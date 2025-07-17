import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import { NavLink, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion, AnimatePresence } from "framer-motion"; // Don't forget to import this at top
const API = process.env.REACT_APP_API_URL;

function AllProduct() {
  const [showFilter, setShowFilter] = useState(false);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const navigate = useNavigate();
  console.log("API:", process.env.REACT_APP_API_URL);

  const categoriesList = [
    "Single Seater Swing",
    "Acrylic Swing",
    "Outdoor Swing",
    "Macrame Swing",
    "3D Swing",
    "Wooden Swings",
    "Designer Swings",
  ];

  // Fetch products whenever filters or sort change
  useEffect(() => {
    applyFilters();
  }, [selectedCategories, minPrice, maxPrice, sortOrder]);

  const applyFilters = async () => {
    try {
      const params = {};
      if (selectedCategories.length > 0) {
        params.categories = selectedCategories
          .map((c) => c.toLowerCase())
          .join(",");
      }
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (sortOrder) params.sort = sortOrder;

      const res = await axios.get(`${API}/api/product/productshow`, {
        params,
      });

      setFilteredProducts(res.data.data);
    } catch (error) {
      console.error("Filter error:", error);
      toast.error("Error loading products");
    }
  };

  const clearFilters = () => {
    setSelectedCategories([]);
    setMinPrice("");
    setMaxPrice("");
    setSortOrder("");
    applyFilters(); // reset all
  };

  const handleCategoryChange = (category) => {
    const updated = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    setSelectedCategories(updated);
  };

  const handleAddToCart = async (productId) => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      toast.error("Please login first.");
      setTimeout(() => navigate("/login"), 2000);
      return;
    }

    try {
      const response = await axios.post(`${API}/api/cart/addtocart`, {
        userId,
        productId,
        quantity: 1,
      });

      if (response.data.success) {
        toast.success("Product added to cart!");
        setTimeout(() => navigate("/cart"), 2000);
      } else {
        toast.error("Failed to add to cart");
      }
    } catch (error) {
      console.error("Cart error:", error);
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
      const res = await axios.post(`${API}/api/wishlist/addtowishlist`, {
        userId,
        productId,
      });

      if (res.data.success) {
        toast.success("Added to wishlist!");
        navigate("/wishlist");
      } else {
        toast.info(res.data.message || "Already in wishlist");
      }
    } catch (err) {
      // Extract error message from server response
      if (err.response && err.response.data && err.response.data.message) {
        toast.info(err.response.data.message);
      } else {
        toast.error("Error adding to wishlist");
      }
    }
  };

  return (
    <div
      style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}
      className="py-4"
    >
      <Header />
      <div className="container-fluid px-3">
        <motion.div
          className="text-center mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h4 className="fw-bold">All Product</h4>

          <p className="text-muted">Home / All Product</p>
        </motion.div>

        <div className="row">
          <AnimatePresence>
            {showFilter && (
              <motion.div
                className="col-12 col-md-3 mb-4"
                initial={{ x: -50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -50, opacity: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              >
                <div className="bg-white rounded p-4 shadow-sm border text-start">
                  <h6>Shop By Category</h6>
                  {categoriesList.map((label, index) => (
                    <div className="form-check" key={index}>
                      <input
                        className="form-check-input"
                        type="checkbox"
                        id={`cat${index}`}
                        onChange={() => handleCategoryChange(label)}
                        checked={selectedCategories.includes(label)}
                      />
                      <label
                        className="form-check-label"
                        htmlFor={`cat${index}`}
                      >
                        {label}
                      </label>
                    </div>
                  ))}
                  <hr />
                  <h6>Shop By Price</h6>
                  <div className="row">
                    <div className="col-6 mb-3">
                      <label className="form-label">Min Price</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Min"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                      />
                    </div>
                    <div className="col-6 mb-3">
                      <label className="form-label">Max Price</label>
                      <input
                        type="text"
                        className="form-control"
                        placeholder="Max"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    className="btn btn-outline-secondary w-100"
                    onClick={clearFilters}
                  >
                    Clear Filters
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className={showFilter ? "col-12 col-md-9" : "col-12"}>
            <div className="d-flex justify-content-between align-items-center mb-3 flex-wrap gap-2">
              <button
                className="btn btn-dark"
                onClick={() => setShowFilter(!showFilter)}
              >
                <i className="bi bi-funnel"></i> Filter
              </button>
            </div>

            <div className="row g-3" style={{ overflowY: "hidden" }}>
              {filteredProducts.map((product, i) => (
                <motion.div
                  key={product._id}
                  className="col-12 col-sm-6 col-md-4 col-lg-3"
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.1 }}
                  transition={{
                    delay: i * 0.1,
                    duration: 0.4,
                    type: "spring",
                    stiffness: 100,
                  }}
                >
                  <NavLink
                    to={`/singleproduct/${product._id}`}
                    className="text-decoration-none text-dark"
                    onClick={() =>
                      sessionStorage.setItem("productId", product._id)
                    }
                  >
                    <div className="card border-0 bg-success-subtle h-100 custom-card">
                      <div className="position-relative overflow-hidden">
                        <img
                          src={`${API}/uploads/${product.image}`}
                          className="card-img-top w-100"
                          alt={product.name}
                          style={{ height: "250px", objectFit: "cover" }}
                        />
                        <div className="position-absolute top-0 end-0 m-2 d-flex flex-column gap-2 action-icons">
                          <button
                            className="btn btn-dark rounded-circle"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToCart(product._id);
                            }}
                          >
                            <i className="fas fa-shopping-cart text-white" />
                          </button>
                          <button
                            className="btn btn-light rounded-circle"
                            onClick={(e) => {
                              e.preventDefault();
                              handleAddToWishlist(product._id);
                            }}
                          >
                            <i className="fas fa-heart text-dark" />
                          </button>
                        </div>
                      </div>
                      <div className="card-body card-hover-body">
                        <h5 className="card-title fw-bold">{product.name}</h5>
                        <small>
                          Categories:{" "}
                          {Array.isArray(product.categories)
                            ? product.categories.join(", ")
                            : product.categories}
                        </small>
                        <p className="card-text small mt-1">
                          {product.description}
                        </p>
                        <p className="fw-bold mb-0">
                          ₹{product.newprice}{" "}
                          <small className="text-decoration-line-through text-muted">
                            ₹{product.oldprice}
                          </small>
                        </p>
                      </div>
                    </div>
                  </NavLink>
                </motion.div>
              ))}

              {filteredProducts.length === 0 && (
                <p className="text-center text-muted">No products found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
      <ToastContainer position="top-center" autoClose={3000} />
    </div>
  );
}

export default AllProduct;
