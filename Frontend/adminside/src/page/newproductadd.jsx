import React, { useState } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function AddNewProduct() {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    image1: null,
    image2: null,
    image3: null,
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleImageChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFormData((prev) => ({
      ...prev,
      [fieldName]: file,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { title, description, image1, image2, image3 } = formData;

    if (!title || !description || !image1 || !image2 || !image3) {
      toast.error("All fields and 3 images are required.");
      return;
    }

    const data = new FormData();
    data.append("title", title);
    data.append("description", description);
    data.append("images", image1);
    data.append("images", image2);
    data.append("images", image3);

    try {
      await axios.post("http://localhost:5000/api/newproduct/newproductadd", data);
      toast.success("Product with 3 images added successfully!");
      setFormData({
        title: "",
        description: "",
        image1: null,
        image2: null,
        image3: null,
      });
      document.getElementById("image1").value = "";
      document.getElementById("image2").value = "";
      document.getElementById("image3").value = "";
    } catch (err) {
      toast.error("Failed to add product");
      console.error(err);
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <div className="card p-4 shadow-sm">
        <h5 className="mb-4 fw-bold text-center">Add New Product (3 Images)</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Title</label>
            <input
              type="text"
              name="title"
              className="form-control"
              value={formData.title}
              onChange={handleChange}
              required
              placeholder="Enter product title"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Product Description</label>
            <textarea
              name="description"
              className="form-control"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              required
              placeholder="Enter product description"
            ></textarea>
          </div>

          <div className="mb-3">
            <label className="form-label">Image 1</label>
            <input
              type="file"
              id="image1"
              accept="image/*"
              className="form-control"
              onChange={(e) => handleImageChange(e, "image1")}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image 2</label>
            <input
              type="file"
              id="image2"
              accept="image/*"
              className="form-control"
              onChange={(e) => handleImageChange(e, "image2")}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Image 3</label>
            <input
              type="file"
              id="image3"
              accept="image/*"
              className="form-control"
              onChange={(e) => handleImageChange(e, "image3")}
              required
            />
          </div>

          <div className="text-center">
            <button className="btn btn-primary px-4" type="submit">
              Add Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
