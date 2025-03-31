import React, { useState, useEffect } from "react";
import axios from "axios";
import { Container, Button, Modal, Form } from "react-bootstrap";
import { FaEdit, FaTrash, FaDownload } from "react-icons/fa";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./Menu.css"; // Ensure this CSS file exists

const API_URL = "http://localhost:5000";

const Menu = () => {
  const [menu, setMenu] = useState([]);
  const [aiMenu, setAiMenu] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [dishData, setDishData] = useState({ _id: "", name: "", price: "" });

  // ✅ Fetch Static Menu
  const fetchMenuData = async () => {
    try {
      const response = await axios.get(`${API_URL}/get_menu`);
      setMenu(response.data);
    } catch (error) {
      console.error("Error fetching menu:", error);
    }
  };

  // Fetch AI-Generated Menu
 const fetchAiMenu = async () => {
  try {
    const response = await axios.get(`${API_URL}/get_ai_menu`);
    console.log("AI Menu API Response:", response.data);

    const filteredData = response.data.map((dish) => {
      let recipeName = "Unnamed Dish";
      let dishPrice = "N/A"; // Default if no price is found

      if (dish.recipe) {
        // Extract Recipe Name
        const match1 = dish.recipe.match(/\*\*Recipe Name:\*\*\s*(.*)/);
        if (match1) {
          recipeName = match1[1].split("\n")[0].trim();
        }

        // Alternative name extraction
        const match2 = dish.recipe.match(/1\.\s*(.*?)\s*-/);
        if (!match1 && match2) {
          recipeName = match2[1].trim();
        }

        // Extract Possible Price
        const priceMatch = dish.recipe.match(/Estimated cost:.*?₹(\d+)/i);
        if (priceMatch) {
          dishPrice = `₹${priceMatch[1]}`;
        }
      }

      return {
        name: recipeName,
        price: dishPrice,
      };
    });

    setAiMenu(filteredData);
  } catch (error) {
    console.error("Error fetching AI menu:", error);
  }
};

  
  
  

  useEffect(() => {
    fetchMenuData();
    fetchAiMenu();
  }, []);
  
  // Force state refresh
  useEffect(() => {
    console.log("AI Menu Updated:", aiMenu);
  }, [aiMenu]);
  

  // Handle Input Change
  const handleChange = (e) => {
    setDishData({ ...dishData, [e.target.name]: e.target.value });
  };

  // Save or Update Dish
  const handleSave = async () => {
    try {
      const existingDish = menu.find((dish) => dish.name.toLowerCase() === dishData.name.toLowerCase());

      if (existingDish && !editMode) {
        alert("Dish already exists! Choose a different name.");
        return;
      }

      if (editMode) {
        await axios.put(`${API_URL}/update_dish/${dishData._id}`, dishData);
      } else {
        dishData._id = Date.now().toString();
        await axios.post(`${API_URL}/add_dish`, dishData);
      }

      fetchMenuData();
      setShowModal(false);
    } catch (error) {
      console.error("Error saving dish:", error);
    }
  };

  // Edit Dish
  const handleEdit = (dish) => {
    setDishData({ _id: dish._id, name: dish.name, price: dish.price });
    setEditMode(true);
    setShowModal(true);
  };

  // Delete Dish
  const handleDelete = async (_id) => {
    try {
      await axios.delete(`${API_URL}/delete_dish/${_id}`);
      fetchMenuData();
    } catch (error) {
      console.error("Error deleting dish:", error);
    }
  };

  // Download Menu as PDF
  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Restaurant Menu", 15, 15);

    const tableData = [...menu, ...aiMenu].map((dish) => [dish.name || "N/A", dish.price ? `₹${dish.price}` : "N/A"]);

    doc.autoTable({
      startY: 25,
      head: [["Dish Name", "Price"]],
      body: tableData,
      styles: { fontSize: 10 },
    });

    doc.save("Restaurant_Menu.pdf");
  };

  return (
    <Container className="menu-container">
      <h2 className="menu-title">🍽️ Our Delicious Menu</h2>
  
      {isEditing ? (
        <>
          <Button variant="secondary" onClick={() => setIsEditing(false)}>
            Back to Menu
          </Button>
          <Button
            variant="primary"
            className="ms-2"
            onClick={() => {
              setEditMode(false);
              setDishData({ _id: "", name: "", price: "" });
              setShowModal(true);
            }}
          >
            Add New Dish
          </Button>
          <Button variant="success" className="ms-2" onClick={downloadPDF}>
            <FaDownload /> Download Menu
          </Button>
  
          <div className="menu-list">
            <h3>📜 Static Recipes</h3>
            <ul>
              {menu.map((dish) => (
                <li key={dish._id}>
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">₹{dish.price}</span>
  
                  <Button variant="info" size="sm" className="me-2" onClick={() => handleEdit(dish)}>
                    <FaEdit /> Edit
                  </Button>
                  <Button variant="danger" size="sm" onClick={() => handleDelete(dish._id)}>
                    <FaTrash /> Delete
                  </Button>
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : (
        <div className="menu-list">
          <h3>📜 Static Recipes</h3>
          <ul>
            {menu.map((dish) => (
              <li key={dish._id}>
                <span className="dish-name">{dish.name}</span>
                <span className="dish-price">₹{dish.price}</span>
              </li>
            ))}
          </ul>
  
          <h3>🤖 AI-Generated Recipes</h3>
          <ul>
            {aiMenu.length > 0 ? (
              aiMenu.map((dish, index) => (
                <li key={index}>
                  <span className="dish-name">{dish.name}</span>
                  <span className="dish-price">₹{dish.price}</span>
                </li>
              ))
            ) : (
              <p>No AI-generated recipes available.</p>
            )}
          </ul>
  
          <Button variant="warning" className="mt-3" onClick={() => setIsEditing(true)}>
            <FaEdit /> Edit Menu
          </Button>
        </div>
      )}
  
      {/* Modal for Adding/Editing Dishes */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{editMode ? "Edit Dish" : "Add New Dish"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Dish Name</Form.Label>
              <Form.Control type="text" name="name" value={dishData.name} onChange={handleChange} required />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Price (₹)</Form.Label>
              <Form.Control type="number" name="price" value={dishData.price} onChange={handleChange} required />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            {editMode ? "Update Dish" : "Add Dish"}
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );  
};

export default Menu;
