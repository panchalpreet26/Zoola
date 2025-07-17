import React, { useEffect, useState } from "react";
import axios from "axios";
import { NavLink } from "react-router-dom";


function Allproducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/product/productshow");
      setProducts(res.data.data);
    } catch (err) {
      alert("Failed to fetch products");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/product/productDelete/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      alert("Product deleted successfully");
    } catch (err) {
      alert("Failed to delete product");
    }
  };

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container py-4">
      
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="fw-bold">All Products</h3>
        <NavLink to="/addproduct" className="btn btn-dark">
          + Add New Product
        </NavLink>
      </div>

      <div className="mb-4">
        <input
          type="text"
          className="form-control"
          placeholder="Search products by name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {filteredProducts.length > 0 ? (
        <div className="row g-4">
          {filteredProducts.map((product) => (
            <div className="col-12 col-md-6 col-lg-4" key={product._id}>
              <div className="card shadow-sm h-100">
                <img
                  src={`http://localhost:5000/uploads/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "230px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h5 className="card-title">{product.name}</h5>
                  <p className="text-muted">
                    Category:{" "}
                    {Array.isArray(product.categories)
                      ? product.categories.join(", ")
                      : product.categories}
                  </p>
                  <p className="card-text" style={{ minHeight: "50px" }}>
                    {product.description}
                  </p>
                  <p>
                    <strong>Price:</strong>{" "}
                    <span className="text-success">₹{product.newprice}</span>{" "}
                    <del className="text-muted">₹{product.oldprice}</del>
                  </p>
                  <p>
                    <strong>Stock:</strong>{" "}
                    <span className="badge bg-info text-dark">
                      {product.stock}
                    </span>
                  </p>
                  <div className="d-flex justify-content-between mt-3">
                    <NavLink
                      to={`/editproduct/${product._id}`}
                      className="btn btn-sm btn-outline-primary"
                    >
                      Edit
                    </NavLink>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => handleDelete(product._id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-muted">No products found.</p>
      )}
    </div>
  );
}

export default Allproducts;
