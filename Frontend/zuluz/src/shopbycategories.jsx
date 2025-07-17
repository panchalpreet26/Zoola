import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import { useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import "./App.css"; // Ensure this has your hover effect CSS
import { motion, AnimatePresence } from "framer-motion"; // Don't forget to import this at top
const API = process.env.REACT_APP_API_URL;

function ShopByCategories() {
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const navigate = useNavigate();

  const categories = [
    "All",
    "Single Seater Swing",
    "Acrylic Swing",
    "Outdoor Swing",
    "Macrame Swing",
    "3D Swing",
    "Wooden Swings",
    "Designer Swings",
  ];

  const fetchProducts = async (category) => {
    try {
      const params = {};
      if (category && category !== "All") {
        params.categories = category.toLowerCase();
      }

      const res = await axios.get(
        `${API}/api/product/productshow`,
        {
          params,
        }
      );

      setProducts(res.data.data);
    } catch (err) {
      console.error("Failed to fetch products:", err);
    }
  };

  useEffect(() => {
    fetchProducts(selectedCategory);
  }, [selectedCategory]);

  const handleAddToCart = async (productId) => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      toast.error("Please login first.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const res = await axios.post(`${API}/api/cart/addtocart`, {
        userId,
        productId,
        quantity: 1,
      });

      if (res.data.success) {
        toast.success("Product added to cart!");
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (err) {
      console.error("Cart error:", err);
      toast.error("Error adding to cart");
    }
  };

  const handleAddToWishlist = async (productId) => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      toast.error("Please login to add to wishlist");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const res = await axios.post(
        `${API}/api/wishlist/addtowishlist`,
        {
          userId,
          productId,
        }
      );

      if (res.data.success) {
        toast.success("Added to wishlist!");
      } else {
        toast.info(res.data.message || "Already in wishlist");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        toast.info(err.response.data.message); // Shows "Already in wishlist"
      } else {
        toast.error("Error adding to wishlist");
      }
    }
  };

  return (
    <div
      className="container-fluid px-3"
      style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}
    >
      <Header />

      <motion.div
        className="text-center mb-4"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h4 className="fw-bold">Shop by Categories</h4>
        <small className="text-muted">Home / Shop by categories</small>
      </motion.div>

      <div className="row align-items-center mb-4">
        <motion.div
          className="col-12 col-md-9 d-flex flex-wrap gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          {categories.map((cat, index) => (
            <button
              key={index}
              className={`btn btn-sm rounded ${
                selectedCategory === cat ? "btn-dark" : "btn-outline-dark"
              }`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </motion.div>
      </div>

     <AnimatePresence mode="wait">
  <div className="row g-4 my-4">
    {products.map((product, index) => (
      <motion.div
        key={product._id}
        className="col-12 col-sm-6 col-md-4 col-lg-3"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4, delay: index * 0.1 }}
      >
        <div className="card border-0 custom-card shadow-sm h-100 position-relative">
          <div className="position-relative overflow-hidden">
            <img
              src={`${API}/uploads/${product.image}`}
              className="card-img-top rounded-top-4 w-100"
              alt={product.name}
              style={{ height: "250px", objectFit: "cover" }}
            />
            <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2 action-icons">
              <button
                className="btn btn-dark rounded-circle"
                onClick={() => handleAddToCart(product._id)}
              >
                <FaShoppingCart className="text-white" />
              </button>
              <button
                className="btn btn-light rounded-circle"
                onClick={() => handleAddToWishlist(product._id)}
              >
                <FaHeart className="text-dark" />
              </button>
            </div>
          </div>
          <div className="card-body">
            <h6 className="fw-bold">{product.name}</h6>
            <p className="text-muted small">{product.description}</p>
            <div className="fw-bold">
              ₹{product.newprice}{" "}
              <small className="text-muted text-decoration-line-through">
                ₹{product.oldprice}
              </small>
            </div>
          </div>
        </div>
      </motion.div>
    ))}
    {products.length === 0 && (
      <motion.p
        className="text-center text-muted"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        No products found.
      </motion.p>
    )}
  </div>
</AnimatePresence>

      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default ShopByCategories;
