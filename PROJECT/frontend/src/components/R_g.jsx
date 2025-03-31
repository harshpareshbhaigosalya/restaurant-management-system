import React, { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { FaTrash } from "react-icons/fa";
import "./rg.css";

const R_g = () => {
    const [inventory, setInventory] = useState([]);
    const [recipe, setRecipe] = useState(null);
    const [loading, setLoading] = useState(false);
    const [newIngredient, setNewIngredient] = useState({ name: "", quantity: "", unit: "" });
    const [selectedCategories, setSelectedCategories] = useState([]);
    const [customCategory, setCustomCategory] = useState("");

    const categories = ["South Indian", "Chinese", "French", "Gujarati", "Fast Food", "Other"];

    useEffect(() => {
        fetchInventory();
    }, []);

    const fetchInventory = async () => {
        try {
            const response = await fetch("http://127.0.0.1:5000/get_products");
            const data = await response.json();
            setInventory(data.map(item => ({
                name: item.pro_name,
                quantity: item.pro_quant,
                unit: item.unit || "unit", // Default unit if not present
                expiry_date: item.pro_expire || "N/A"
            })));
        } catch (error) {
            console.error("Error fetching inventory:", error);
        }
    };

    const addIngredient = async () => {
        if (!newIngredient.name || !newIngredient.quantity || !newIngredient.unit) return;
        try {
            const response = await fetch("http://127.0.0.1:5000/add_product", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    pro_name: newIngredient.name,
                    pro_quant: newIngredient.quantity,
                    pro_price: 0, // Default price, update later if needed
                    unit: newIngredient.unit
                })
            });
            if (response.ok) {
                setInventory([...inventory, { ...newIngredient, expiry_date: "N/A" }]);
                setNewIngredient({ name: "", quantity: "", unit: "" });
                fetchInventory(); // Refresh inventory
            }
        } catch (error) {
            console.error("Error adding ingredient:", error);
        }
    };

    const deleteIngredient = async (index) => {
        const product = inventory[index];
        try {
            const response = await fetch("http://127.0.0.1:5000/get_products");
            const products = await response.json();
            const target = products.find(p => p.pro_name === product.name);
            if (target) {
                await fetch(`http://127.0.0.1:5000/delete_product/${target._id}`, { method: "DELETE" });
                fetchInventory(); // Refresh inventory
            }
        } catch (error) {
            console.error("Error deleting ingredient:", error);
        }
    };

    const toggleCategory = (category) => {
        if (selectedCategories.includes(category)) {
            setSelectedCategories(selectedCategories.filter((c) => c !== category));
        } else {
            setSelectedCategories([...selectedCategories, category]);
        }
    };

    const generateRecipe = async () => {
        if (inventory.length === 0 || selectedCategories.length === 0) {
            setRecipe("Please add ingredients and select at least one category!");
            return;
        }

        setLoading(true);

        const ingredients = inventory.map(item => `${item.name} (${item.quantity} ${item.unit})`);
        const selected = selectedCategories.includes("Other") 
            ? [...selectedCategories.filter(c => c !== "Other"), customCategory] 
            : selectedCategories;

        try {
            const response = await fetch("http://127.0.0.1:5000/generate-recipe", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ ingredients, categories: selected })
            });

            if (!response.ok) {
                setRecipe("Oops! Something went wrong. Please try again.");
                throw new Error(`Server Error: ${response.status}`);
            }

            const data = await response.json();
            setRecipe(data.recipe);
        } catch (error) {
            console.error("Error generating recipe:", error);
            setRecipe("Failed to generate recipe. Please try again later.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="dashboard-container">
            <h1 className="title">Intelligent Menu Optimization</h1>

            <div className="add-ingredient-form">
                <input 
                    type="text" 
                    placeholder="Ingredient Name" 
                    value={newIngredient.name}
                    onChange={(e) => setNewIngredient({ ...newIngredient, name: e.target.value })} 
                />
                <input 
                    type="number" 
                    placeholder="Quantity" 
                    value={newIngredient.quantity}
                    onChange={(e) => setNewIngredient({ ...newIngredient, quantity: e.target.value })} 
                />
                <input 
                    type="text" 
                    placeholder="Unit (e.g., kg, pcs)" 
                    value={newIngredient.unit}
                    onChange={(e) => setNewIngredient({ ...newIngredient, unit: e.target.value })} 
                />
                <button onClick={addIngredient}>Add Ingredient</button>
            </div>

            <div className="inventory-section">
                <h2>Inventory (Expiring & Surplus)</h2>
                <ul className="inventory-list">
                    {inventory.map((item, index) => (
                        <li key={index} className="inventory-item">
                            <span>{item.name} - {item.quantity} {item.unit} (Exp: {item.expiry_date})</span>
                            <button className="delete-button" onClick={() => deleteIngredient(index)}>
                                <FaTrash />
                            </button>
                        </li>
                    ))}
                </ul>
            </div>

            <div className="category-section">
                <h2>Select Food Categories</h2>
                <div className="category-list">
                    {categories.map((category) => (
                        <label key={category} className="category-item">
                            <input
                                type="checkbox"
                                checked={selectedCategories.includes(category)}
                                onChange={() => toggleCategory(category)}
                            />
                            {category}
                        </label>
                    ))}
                </div>
                {selectedCategories.includes("Other") && (
                    <input
                        type="text"
                        placeholder="Enter custom category"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                        className="custom-category-input"
                    />
                )}
                <button className="generate-button" onClick={generateRecipe} disabled={loading}>
                    {loading ? "Generating..." : "Generate Recipe"}
                </button>
            </div>

            {recipe && (
                <div className="recipe-section">
                    <h2>AI-Generated Recipe</h2>
                    <div className="recipe-text">
                        <ReactMarkdown>{recipe}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
};

export default R_g;