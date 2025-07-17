import React, { useEffect, useState } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { NavLink, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import Header from "./header";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const API = process.env.REACT_APP_API_URL;


export default function Wishlist() {
  const [wishlistItems, setWishlistItems] = useState([]);
  const navigate = useNavigate();

  const fetchWishlist = async () => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      toast.error("Please login to view wishlist");
      return navigate("/login");
    }

    try {
      const res = await axios.get(
        `${API}/api/wishlist/getwishlistbyuserid/${userId}`
      );
      setWishlistItems(res.data.data);
    } catch (err) {
      console.error("Error fetching wishlist:", err);
      toast.error("Failed to load wishlist");
    }
  };

  const handleDelete = async (wishlistId) => {
    try {
      await axios.delete(
        `${API}/api/wishlist/deletewishlist/${wishlistId}`
      );
      toast.success("Item removed from wishlist");
      fetchWishlist(); // Refresh after deletion
    } catch (err) {
      console.error("Error deleting wishlist item:", err);
      toast.error("Error removing item");
    }
  };

  const handleAddToCart = async (productId) => {
    const userId = sessionStorage.getItem("userid");

    if (!userId) {
      toast.error("Please login to add products to cart.");
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
        toast.warning("Failed to add to cart");
      }
    } catch (err) {
      console.error("Add to cart error:", err);
      toast.error("Something went wrong while adding to cart.");
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, []);

  return (
    <div>
      <Header />
      <div
        className="text-dark"
        style={{ fontFamily: "Poppins, sans-serif", backgroundColor: "#FFF5EB" }}
      >
        <div className="container py-5">
          <h4 className="mb-3">Wishlist</h4>
          <p className="text-muted">Home / Wishlist</p>

          <div className="row g-3">
            {wishlistItems.length > 0 ? (
              wishlistItems.map((item, index) => (
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.5, type: "spring" }}
                  className="col-12 col-md-6"
                  key={item._id}
                >
                  <div className="card shadow-sm h-100">
                    <div className="row g-0 h-100">
                      <div className="col-4">
                        <img
                          src={`${API}/uploads/${item.productId.image}`}
                          className="img-fluid rounded-start"
                          alt={item.productId.name}
                          style={{ height: "150px", width: "100%", objectFit: "cover" }}
                        />
                      </div>
                      <div className="col-8 d-flex align-items-center">
                        <div className="card-body">
                          <h6 className="card-title mb-1">{item.productId.name}</h6>
                          <p className="text-muted small mb-2">
                            ₹{item.productId.newprice}
                          </p>
                          <div className="d-flex flex-wrap gap-2">
                            <button
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => {
                                sessionStorage.setItem("productId", item.productId._id);
                                navigate(`/singleproduct/${item.productId._id}`);
                              }}
                            >
                              View Product
                            </button>
                            <button
                              className="btn btn-sm btn-outline-dark"
                              onClick={() => handleAddToCart(item.productId._id)}
                            >
                              Add to Cart
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger ms-auto"
                              onClick={() => handleDelete(item._id)}
                            >
                              <FaTrash />
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="col-12 text-center text-muted py-4">
                Your wishlist is empty.
              </div>
            )}
          </div>

          <div className="row">
            <div className="col-12 d-flex">
              <div className="mt-3">
                <NavLink
                  to="/allproduct"
                  className="btn btn-outline-dark d-inline-flex align-items-center"
                >
                  <i className="fas fa-arrow-left me-2" />
                  Continue Shopping
                </NavLink>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}