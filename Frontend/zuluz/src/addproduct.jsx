import React, { useState } from "react";
import axios from "axios";
import Header from "./header";
import { useNavigate } from "react-router-dom";

export default function AddProduct() {
  const [name, setName] = useState("");
  const [categories, setCategories] = useState("");
  const [oldprice, setOldprice] = useState("");
  const [newprice, setNewprice] = useState("");
  const [stock, setStock] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", name);
    formData.append("categories", categories);
    formData.append("oldprice", oldprice);
    formData.append("newprice", newprice);
    formData.append("stock", stock);
    formData.append("description", description);
    formData.append("image", image);

    try {
      await axios.post(
        "http://localhost:5000/api/product/addproduct",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      alert("Product added successfully!");
      navigate("/allproduct");

      // Reset form
      setName("");
      setCategories("");
      setOldprice("");
      setNewprice("");
      setStock("");
      setDescription("");
      setImage(null);
    } catch (err) {
      console.error("Error uploading product:", err);
      alert("Failed to add product. Try again.");
    }
  };

  return (
    <div className="container py-4">
      <Header />
      <h3 className="mb-4">Add Product</h3>
      <div className="row">
        <div className="col-md-6 mx-auto text-start">
          <form onSubmit={handleSubmit} encType="multipart/form-data">
            <div className="mb-3">
              <label className="form-label">Product Name</label>
              <input
                type="text"
                className="form-control"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Category</label>
              <select
                className="form-select"
                value={categories}
                onChange={(e) => setCategories(e.target.value)}
                required
              >
                <option value="">Select Category</option>
                <option value="Single Seater Swing">Single Seater Swing</option>
                <option value="Acrylic Swing">Acrylic Swing</option>
                <option value="Outdoor Swing">Outdoor Swing</option>
                <option value="Macrame Swing">Macrame Swing</option>
                <option value="3D Swing">3D Swing</option>
                <option value="Wooden Swings">Wooden Swings</option>
                <option value="Designer Swings">Designer Swings</option>
              </select>
            </div>

            <div className="row">
              <div className="col-md-4 mb-3">
                <label className="form-label">Old Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={oldprice}
                  onChange={(e) => setOldprice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">New Price</label>
                <input
                  type="text"
                  className="form-control"
                  value={newprice}
                  onChange={(e) => setNewprice(e.target.value)}
                  required
                />
              </div>
              <div className="col-md-4 mb-3">
                <label className="form-label">Stock</label>
                <input
                  type="number"
                  className="form-control"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea
                className="form-control"
                rows="3"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              ></textarea>
            </div>

            <div className="mb-3">
              <label className="form-label">Product Image</label>
              <input
                type="file"
                className="form-control"
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary">
              Add Product
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
