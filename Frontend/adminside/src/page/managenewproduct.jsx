import React, { useEffect, useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function ManageNewProducts() {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/newproduct/newproductshow");
      setProducts(res.data);
    } catch (err) {
      console.error("Fetch error:", err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/newproduct/newproductdelete/${id}`);
      toast.success("Product deleted");
      fetchProducts();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const handleEditChange = (e) => {
    setEditProduct({ ...editProduct, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setEditProduct({ ...editProduct, newImages: Array.from(e.target.files) });
  };

  const handleUpdate = async () => {
    const formData = new FormData();
    formData.append("title", editProduct.title);
    formData.append("description", editProduct.description);

    if (editProduct.newImages) {
      editProduct.newImages.forEach((img) => formData.append("images", img));
    }

    try {
      await axios.put(
        `http://localhost:5000/api/newproduct/newproductupdate/${editProduct._id}`,
        formData
      );
      toast.success("Product updated");
      setEditProduct(null);
      fetchProducts();
    } catch (err) {
      toast.error("Update failed");
    }
  };

  return (
    <div className="container py-5">
      <ToastContainer />
      <h3 className="text-center mb-4 fw-bold">🛠️ Manage New Products</h3>

      <div className="row" >
        {products.map((product) => (
          <div key={product._id} className="col-md-6 col-lg-4 mb-4">
            <div className="card shadow-sm h-100 p-3 rounded-4">
              {editProduct && editProduct._id === product._id ? (
                <>
                  <input
                    type="text"
                    name="title"
                    value={editProduct.title}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Title"
                  />
                  <textarea
                    name="description"
                    value={editProduct.description}
                    onChange={handleEditChange}
                    className="form-control mb-2"
                    placeholder="Description"
                    rows={3}
                  />
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageChange}
                    className="form-control mb-3"
                  />
                  <div className="d-flex justify-content-between">
                    <button className="btn btn-success w-48" onClick={handleUpdate}>
                      Save
                    </button>
                    <button
                      className="btn btn-secondary w-48"
                      onClick={() => setEditProduct(null)}
                    >
                      Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <h5 className="fw-bold text-primary">{product.title}</h5>
                  <p className="text-muted small mb-2">{product.description}</p>
                  <div className="d-flex flex-wrap gap-2 mb-3">
                    {product.images.map((img, i) => (
                      <img
                        key={i}
                        src={`http://localhost:5000/uploads/${img}`}
                        alt="product"
                        height="60"
                        style={{ borderRadius: "8px", objectFit: "cover" }}
                      />
                    ))}
                  </div>
                  <div className="d-flex justify-content-between">
                    <button
                      className="btn btn-outline-primary w-48"
                      onClick={() => setEditProduct(product)}
                    >
                      Edit
                    </button>
                    <button
                      className="btn btn-outline-danger w-48"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
