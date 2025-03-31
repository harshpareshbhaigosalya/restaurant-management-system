import React, { useState, useEffect } from "react";
import axios from "axios";
import "./Inventory.css";

const API_URL = "http://127.0.0.1:5000";

const Inventory = () => {
    const [products, setProducts] = useState([]);
    const [form, setForm] = useState({
        pro_id: "",
        pro_name: "",
        pro_category: "",
        pro_quant: "",
        pro_manu: "",
        pro_expire: "",
        pro_price: "",
        unit: ""
    });

    // Fetch Products from API
    const fetchProducts = async () => {
        try {
            const response = await axios.get(`${API_URL}/get_products`);
            setProducts(response.data);
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Handle Form Input Changes
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    // Handle Product Name Input & Auto-fill Details
    const handleProductChange = async (e) => {
        const name = e.target.value;
        setForm({ ...form, pro_name: name });

        if (name) {
            try {
                const response = await axios.get(`${API_URL}/get_products`);
                const existingProduct = response.data.find((prod) => prod.pro_name.toLowerCase() === name.toLowerCase());

                if (existingProduct) {
                    setForm((prev) => ({
                        ...prev,
                        pro_id: existingProduct._id,
                        pro_category: existingProduct.pro_category || "",
                        pro_manu: existingProduct.pro_manu || "",
                        pro_expire: existingProduct.pro_expire || "",
                        pro_price: existingProduct.pro_price || "",
                        unit: existingProduct.unit || "unit",
                        pro_quant: "" // Reset quantity for new addition
                    }));
                }
            } catch (error) {
                console.error("Error fetching product details:", error);
            }
        }
    };

    // Add or Update Product
    const addProduct = async () => {
        try {
            const existingProduct = products.find((p) => p.pro_name.toLowerCase() === form.pro_name.toLowerCase());

            if (existingProduct && form.pro_id) {
                // Update existing product quantity
                const updatedQuantity = parseInt(existingProduct.pro_quant) + parseInt(form.pro_quant);
                await axios.put(`${API_URL}/update_product/${existingProduct._id}`, {
                    pro_quant: updatedQuantity,
                    pro_price: form.pro_price,
                });
                alert("Product quantity updated!");
            } else {
                // Add new product
                await axios.post(`${API_URL}/add_product`, {
                    pro_name: form.pro_name,
                    pro_category: form.pro_category,
                    pro_quant: form.pro_quant,
                    pro_manu: form.pro_manu,
                    pro_expire: form.pro_expire,
                    pro_price: form.pro_price,
                    unit: form.unit || "unit",
                });
                alert("New product added!");
            }

            fetchProducts(); // Refresh product list
            resetForm();
        } catch (error) {
            console.error("Error adding/updating product:", error);
        }
    };

    // Delete Product
    const deleteProduct = async (_id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            try {
                await axios.delete(`${API_URL}/delete_product/${_id}`);
                fetchProducts();
                alert("Product deleted successfully!");
            } catch (error) {
                console.error("Error deleting product:", error);
            }
        }
    };

    // Reset Form
    const resetForm = () => {
        setForm({
            pro_id: "",
            pro_name: "",
            pro_category: "",
            pro_quant: "",
            pro_manu: "",
            pro_expire: "",
            pro_price: "",
            unit: ""
        });
    };

    return (
        <div className="inventory-container">
            <h2 className="inventory-title">Inventory Management</h2>

            {/* Product Form */}
            <div className="form-container">
                <input
                    type="text"
                    name="pro_name"
                    placeholder="Product Name"
                    value={form.pro_name}
                    onChange={handleProductChange}
                    required
                />
                <input
                    type="text"
                    name="pro_category"
                    placeholder="Category"
                    value={form.pro_category}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="pro_quant"
                    placeholder="Quantity"
                    value={form.pro_quant}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="pro_manu"
                    placeholder="Manufacture Date"
                    value={form.pro_manu}
                    onChange={handleChange}
                    required
                />
                <input
                    type="date"
                    name="pro_expire"
                    placeholder="Expiry Date"
                    value={form.pro_expire}
                    onChange={handleChange}
                    required
                />
                <input
                    type="number"
                    name="pro_price"
                    placeholder="Price"
                    value={form.pro_price}
                    onChange={handleChange}
                    required
                />
                <input
                    type="text"
                    name="unit"
                    placeholder="Unit (e.g., kg, pcs)"
                    value={form.unit}
                    onChange={handleChange}
                    required
                />
                <button className="add-product-btn" onClick={addProduct}>
                    {products.some((p) => p.pro_name.toLowerCase() === form.pro_name.toLowerCase())
                        ? "Update Product"
                        : "Add Product"}
                </button>
            </div>

            {/* Product List */}
            <div className="product-grid">
                {products.map((product) => (
                    <div className="product-card" key={product._id}>
                        <div className="card-body">
                            <h3 className="card-title">{product.pro_name}</h3>
                            <p className="card-text">Category: {product.pro_category}</p>
                            <p className="card-text">Quantity: {product.pro_quant} {product.unit}</p>
                            <p className="card-text">MFG: {product.pro_manu}</p>
                            <p className="card-text">EXP: {product.pro_expire}</p>
                            <p className="card-text">Price: ₹{product.pro_price}</p>
                            <button className="delete-btn" onClick={() => deleteProduct(product._id)}>
                                Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Inventory;
