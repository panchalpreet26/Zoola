import React, { useEffect, useState } from "react";
import Header from "./header";
import "./App.css";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { motion } from "framer-motion";
const API = process.env.REACT_APP_API_URL;

function Desktop() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [instaImages, setInstaImages] = useState([]);
  const [topIndex, setTopIndex] = useState(0);
  const topSellingProducts = products.slice(0, 5);
  const currentProduct = topSellingProducts[topIndex] || {};
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    // Fetch banner data from backend
    axios
      .get(`${API}/api/banner/all`) // Adjust the URL if needed
      .then((res) => setBanners(res.data))
      .catch((err) => console.error("Failed to fetch banners:", err));
  }, []);
  useEffect(() => {
    axios
      .get(`${API}/api/product/insta-products`)
      .then((res) => setInstaImages(res.data.data))
      .catch((err) => console.log("Instagram fetch error:", err));
  }, []);

  useEffect(() => {
    axios
      .get(`${API}/api/product/productshow`)
      .then((res) => {
        setProducts(res.data.data);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const filteredByCategory = Object.values(
    products.reduce((acc, product) => {
      if (!acc[product.categories]) {
        acc[product.categories] = product;
      }
      return acc;
    }, {})
  );
  const handleAddToCart = async (productId) => {
    const userId = sessionStorage.getItem("userid");

    if (!userId) {
      toast.error("Please login first.");
      setTimeout(() => {
        navigate("/login");
      }, 3000);
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/cart/addtocart`,
        {
          userId,
          productId,
          quantity: 1,
        }
      );

      if (response.data.success) {
        toast.success("Product added to cart!");
        setTimeout(() => {
          navigate("/cart");
        }, 3000);
      } else {
        alert("Something went wrong.");
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      alert("Error adding to cart");
    }
  };
  const handleLoginClick = () => {
    const userId = sessionStorage.getItem("userid");
    if (userId) {
      toast.success("You're already logged in! Redirecting to cart...");
      setTimeout(() => navigate("/cart"), 2000);
    } else {
      toast.info("Please log in first...");
      setTimeout(() => navigate("/login"), 2000);
    }
  };

  const handleNavigateToProduct = (productId) => {
    sessionStorage.setItem("productId", productId);
    navigate(`/singleproduct/${productId}`);
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
        navigate("/wishlist");
      } else {
        toast.info(res.data.message || "Already in wishlist");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Error adding to wishlist");
    }
  };

  return (
    <div className="main-container">
      <Header />

      {/* Banner Carousel */}
      {/* Responsive Bootstrap Carousel Banner */}
      {/* Responsive Bootstrap Carousel with height based on screen size */}
      <motion.div
        id="mainCarousel"
        className="carousel slide carousel-fade p-3"
        data-bs-ride="carousel"
        data-bs-interval="5000"
        style={{ backgroundColor: "#FFF5EB" }}
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <div className="carousel-inner">
          {banners.map((banner, i) => (
            <div key={i} className={`carousel-item ${i === 0 ? "active" : ""}`}>
              {/* Desktop & Tablet View */}
              <img
                src={`${API}/uploads/${banner.image}`}
                className="d-none d-md-block w-100 img-fluid rounded-4"
                alt={`Banner ${i}`}
                style={{ height: "80vh", objectFit: "cover" }}
              />

              {/* Mobile View */}
              <img
                src={`${API}/uploads/${banner.image}`}
                className="d-block d-md-none w-100 img-fluid rounded-4"
                alt={`Banner Mobile ${i}`}
                style={{ height: "40vh", objectFit: "cover" }}
              />
            </div>
          ))}
        </div>

        <button
          className="carousel-control-prev"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="prev"
        >
          <span className="carousel-control-prev-icon" />
          <span className="visually-hidden">Previous</span>
        </button>
        <button
          className="carousel-control-next"
          type="button"
          data-bs-target="#mainCarousel"
          data-bs-slide="next"
        >
          <span className="carousel-control-next-icon" />
          <span className="visually-hidden">Next</span>
        </button>
      </motion.div>

      {/* Featured Collection */}
      <div className="container mt-5">
        <div className="row mb-4">
          <div className="col-md-6">
            <h2 className="fw-semibold text-start">Featured collection</h2>
          </div>
          <div className="col-md-6 text-md-end">
            <p>
              "Introducing our latest innovation – a perfect blend of technology
              and design..."
            </p>
          </div>
        </div>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {products.slice(0, 4).map((product, i) => (
            <motion.div
              key={i}
              onClick={() => handleNavigateToProduct(product._id)}
              style={{ cursor: "pointer" }}
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              transition={{
                duration: 0.4,
                delay: i * 0.1,
                type: "spring",
                stiffness: 80,
              }}
              whileHover={{
                scale: 1.06,
                y: -5,

                transition: { type: "spring", stiffness: 300, damping: 15 },
              }}
            >
              <div className="card border-0 rounded-4 bg-success-subtle position-relative">
                <div className="position-relative overflow-hidden rounded-4">
                  <img
                    src={`${API}/uploads/${product.image}`}
                    className="card-img-top"
                    alt={product.name}
                    style={{ height: "250px", objectFit: "cover" }}
                  />
                </div>
                <div className="card-body">
                  <h5 className="card-title fw-bold">{product.name}</h5>
                  <p className="small">{product.description}</p>
                  <p className="fw-bold mb-0">
                    ₹{product.newprice}{" "}
                    <small className="text-decoration-line-through text-muted">
                      ₹{product.oldprice}
                    </small>
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Top Selling Section */}
      <div
        className="container-fluid my-5 py-5"
        style={{ backgroundColor: "#FFF5EB" }}
      >
        <div className="row align-items-center g-4">
          <div className="col-md-6">
            <div className="position-relative rounded-4 overflow-hidden">
              <img
                src={`${API}/uploads/${currentProduct.image}`}
                className="img-fluid rounded-4"
                alt={currentProduct.name}
                style={{ height: "400px", objectFit: "cover", width: "100%" }}
              />
              <button className="btn btn-light position-absolute top-50 start-50 translate-middle rounded-circle p-3">
                <i className="fas fa-play" />
              </button>
            </div>
          </div>
          <div className="col-md-6 text-center">
            <h5 className="fw-bold py-3">Top Selling Product</h5>
            <div className="d-flex align-items-center justify-content-center">
              <button
                className="btn btn-outline-dark me-2 rounded-circle"
                onClick={() =>
                  setTopIndex((prev) =>
                    prev > 0 ? prev - 1 : topSellingProducts.length - 1
                  )
                }
              >
                <i className="fas fa-chevron-left" />
              </button>
              <div>
                <img
                  src={`${API}/uploads/${currentProduct.image}`}
                  className="img-fluid rounded-3 mb-2"
                  style={{ width: 200, height: 200, objectFit: "cover" }}
                  alt={currentProduct.name}
                />
                <h6 className="fw-bold">{currentProduct.name}</h6>
                <p className="small text-muted">
                  {currentProduct.description?.slice(0, 50)}...
                </p>
                <p className="fw-bold">
                  ₹{currentProduct.newprice}{" "}
                  <small className="text-decoration-line-through text-muted">
                    ₹{currentProduct.oldprice}
                  </small>
                </p>
              </div>
              <button
                className="btn btn-outline-dark ms-2 rounded-circle"
                onClick={() =>
                  setTopIndex((prev) => (prev + 1) % topSellingProducts.length)
                }
              >
                <i className="fas fa-chevron-right" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Shop by Category */}
      <motion.div
        className="container my-5"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.2 }}
        transition={{ duration: 0.6 }}
      >
        <h5 className="fw-bold mb-4 text-start">Shop by Category</h5>

        <div className="row row-cols-1 row-cols-sm-2 row-cols-md-4 g-4">
          {filteredByCategory.map((product, i) => (
            <motion.div
              key={i}
              className="col overflow-hidden"
              initial={{ opacity: 0, scale: 0.9, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{
                delay: i * 0.1,
                duration: 0.4,
                type: "spring",
                stiffness: 100,
              }}
              whileHover={{
                scale: 1.05,
                y: -5,

                transition: { type: "spring", stiffness: 300, damping: 18 },
              }}
            >
              <div className="card border-0 rounded-4 bg-success-subtle">
                <img
                  src={`${API}/uploads/${product.image}`}
                  className="card-img-top"
                  alt={product.name}
                  style={{ height: "250px", objectFit: "cover" }}
                />
                <div className="card-body">
                  <h6 className="fw-bold">{product.name}</h6>
                  <p className="small mb-1">
                    {product.description?.slice(0, 50)}...
                  </p>
                  <span
                    onClick={() => handleNavigateToProduct(product._id)}
                    className="text-decoration-none btn btn-outline-dark"
                    style={{ cursor: "pointer" }}
                  >
                    View Product →
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Features */}
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#FFF5EB" }}
      >
        <div className="row row-cols-1 row-cols-md-4 g-3 justify-content-center">
          {[
            {
              icon: "truck",
              title: "PAN India Delivery",
              text: "Get your products delivered at your doorstep.",
            },
            {
              icon: "shield-alt",
              title: "Quality Assurance",
              text: "Easy exchange and return options.",
            },
            {
              icon: "headset",
              title: "Online Support",
              text: "24 hours a day, 7 days a week.",
            },
            {
              icon: "credit-card",
              title: "Flexible Payment",
              text: "Pay with multiple payment options.",
            },
          ].map((feature, index) => (
            <div key={index} className="col">
              <div className="p-4 bg-dark text-white rounded-5 text-start">
                <i className={`fas fa-${feature.icon} mb-2 fs-5`} />
                <h6 className="fw-bold">{feature.title}</h6>
                <p className="small">{feature.text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Instagram Section */}
      <div
        className="container-fluid py-5"
        style={{ backgroundColor: "#FFF5EB" }}
      >
        <div className="row">
          <div className="col-md-6 d-flex justify-content-center align-items-center">
            <div className="text-center">
              <p className="fw-bold pb-4">@zulasnmore_india</p>
              {instaImages[0] && (
                <img
                  src={`${API}/uploads/${instaImages[0].image}`}
                  className="img-fluid rounded-4"
                  alt="Instagram Highlight"
                  style={{ maxHeight: "400px", objectFit: "cover" }}
                />
              )}
            </div>
          </div>
          <div className="col-md-6 d-flex justify-content-center align-items-center flex-wrap">
            {instaImages.slice(1, 5).map((img, index) => (
              <div key={index} className="p-2 col-6">
                <img
                  src={`${API}/uploads/${img.image}`}
                  className="img-fluid rounded-5"
                  alt={`Instagram ${index + 1}`}
                  style={{ height: "200px", objectFit: "cover", width: "100%" }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default Desktop;
