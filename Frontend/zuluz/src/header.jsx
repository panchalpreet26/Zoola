// Updated Header Component with Framer Motion Animated Toggle
import React, { useState, useEffect, useRef } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, signOut, onAuthStateChanged } from "./firebaseconfig";
import { motion } from "framer-motion";

function Header() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userImage, setUserImage] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const dropdownRef = useRef(null);
  const isGoogleLogin = sessionStorage.getItem("googleLogin") === "true";

  useEffect(() => {
    const image = sessionStorage.getItem("image");
    if (image) setUserImage(image);
  }, []);

  useEffect(() => {
    const userId = sessionStorage.getItem("userid");

    if (userId) {
      if (!sessionStorage.getItem("image") && !isGoogleLogin) {
        axios
          .get(`http://localhost:5000/api/user/user/${userId}`)
          .then((res) => {
            const user = res.data.user;
            if (user && user.image) {
              const url = `http://localhost:5000/uploads/${user.image}`;
              sessionStorage.setItem("image", url);
              setUserImage(url);
            }
          })
          .catch((err) => console.error("Failed to fetch user:", err));
      }

      axios
        .get(`http://localhost:5000/api/cart/user/${userId}`)
        .then((res) => {
          const cartItems = res.data.cart || res.data.data || [];
          setCartCount(cartItems.length);
        })
        .catch(() => setCartCount(0));

      axios
        .get(`http://localhost:5000/api/wishlist/user/${userId}`)
        .then((res) => {
          const wishlistItems = res.data.wishlist || res.data.data || [];
          setWishlistCount(wishlistItems.length);
        })
        .catch(() => setWishlistCount(0));
    }
  }, [isGoogleLogin]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user && !sessionStorage.getItem("userid")) {
        sessionStorage.setItem("email", user.email);
        sessionStorage.setItem("firstname", user.displayName?.split(" ")[0]);
        sessionStorage.setItem(
          "lastname",
          user.displayName?.split(" ")[1] || ""
        );
        sessionStorage.setItem("image", user.photoURL);
        sessionStorage.setItem("googleLogin", "true");
        setUserImage(user.photoURL);
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCartClick = () => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      // toast.error("Please login first to access your cart.");
      setTimeout(() => navigate("/login"), 200);
    } else {
      // setIsLoading(true);
      setTimeout(() => {
        // setIsLoading(false);
        navigate("/cart");
      }, 200);
    }
  };

  const handleWishlistClick = () => {
    const userId = sessionStorage.getItem("userid");
    if (!userId) {
      // toast.error("Please login first to access your wishlist.");
      setTimeout(() => navigate("/login"), 200);
    } else {
      // setIsLoading(true);
      setTimeout(() => {
        // setIsLoading(false);
        navigate("/wishlist");
      }, 200);
    }
  };

  const handleLogout = () => {
    signOut(auth)
      .then(() => {
        sessionStorage.clear();
        toast.success("Logged out successfully");
        navigate("/login");
      })
      .catch((error) => {
        console.error("Logout error:", error);
        toast.error("Logout failed");
      });
  };

  return (
    <>
      {isLoading && (
        <div className="full-page-loader">
          <div className="loader-box">
            <div className="spinner-border text-dark" role="status" />
          </div>
        </div>
      )}

      <header>
        <div
          className="container-fluid py-3 px-3"
          style={{ backgroundColor: "#FFF5EB" }}
        >
          <div className="row align-items-center">
            <div className="col-12 col-md-1 d-flex d-md-block justify-content-start mb-2 mb-md-0">
              <motion.button
                onClick={() => setMenuOpen(!menuOpen)}
                animate={menuOpen ? "open" : "closed"}
                initial="closed"
                style={{
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  width: 50,
                  height: 50,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  padding: 0,
                }}
              >
                <motion.svg width="23" height="23" viewBox="0 0 23 23">
                  <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="black"
                    strokeLinecap="round"
                    variants={{
                      closed: { d: "M 2 2.5 L 20 2.5" },
                      open: { d: "M 3 16.5 L 17 2.5" },
                    }}
                  />
                  <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="black"
                    strokeLinecap="round"
                    d="M 2 9.423 L 20 9.423"
                    variants={{
                      closed: { opacity: 1 },
                      open: { opacity: 0 },
                    }}
                    transition={{ duration: 0.1 }}
                  />
                  <motion.path
                    fill="transparent"
                    strokeWidth="3"
                    stroke="black"
                    strokeLinecap="round"
                    variants={{
                      closed: { d: "M 2 16.346 L 20 16.346" },
                      open: { d: "M 3 2.5 L 17 16.346" },
                    }}
                  />
                </motion.svg>
              </motion.button>
            </div>

            <div className="col-12 col-md-10 text-center mb-2 mb-md-0">
              <NavLink to={"/"}>
                <img
                  src="/image/zulaslogo.png"
                  alt="Zulas Logo"
                  style={{
                    height: "60px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                />
              </NavLink>
            </div>

            <div
              className="col-12 col-md-1 d-flex justify-content-end mt-2 mt-md-0"
              ref={dropdownRef}
            >
              <button
                className="btn btn-outline-dark rounded-circle position-relative mx-1"
                onClick={handleCartClick}
              >
                <i className="fas fa-shopping-cart" />
                {cartCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {cartCount}
                  </span>
                )}
              </button>

              <button
                className="btn btn-outline-dark rounded-circle position-relative mx-1"
                onClick={handleWishlistClick}
              >
                <i className="fas fa-heart" />
                {wishlistCount > 0 && (
                  <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                    {wishlistCount}
                  </span>
                )}
              </button>

              {sessionStorage.getItem("userid") ? (
                <div className="position-relative">
                  <button
                    className="btn btn-outline-dark rounded-circle mx-1 d-flex align-items-center justify-content-center"
                    style={{
                      width: "45px",
                      height: "45px",
                      overflow: "hidden",
                      padding: 0,
                    }}
                    onClick={() => setDropdownOpen(!dropdownOpen)}
                  >
                    {isGoogleLogin ? (
                      <i className="fas fa-user fs-5" />
                    ) : (
                      <img
                        src={userImage}
                        alt="User"
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "50%",
                        }}
                      />
                    )}
                  </button>

                  {dropdownOpen && (
                    <div className="user-dropdown bg-white border shadow rounded-3 mt-2 py-2 px-3 position-absolute end-0">
                      <button
                        className="btn btn-sm text-start w-100 mb-2 fw-semibold text-dark"
                        style={{ backgroundColor: "#FFF5EB" }}
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/userprofile", { state: { tab: "info" } });
                        }}
                      >
                        <i className="fas fa-user me-2 text-primary" />
                        My Profile
                      </button>
                      <button
                        className="btn btn-sm text-start w-100 mb-2 fw-semibold text-dark"
                        style={{ backgroundColor: "#FFF5EB" }}
                        onClick={() => {
                          setDropdownOpen(false);
                          navigate("/userprofile", {
                            state: { tab: "orders" },
                          });
                        }}
                      >
                        <i className="fas fa-box me-2 text-primary" />
                        My Orders
                      </button>
                      <button
                        className="btn btn-sm text-start w-100 fw-semibold text-danger"
                        style={{ backgroundColor: "#FFF5EB" }}
                        onClick={handleLogout}
                      >
                        <i className="fas fa-sign-out-alt me-2" />
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <NavLink
                  to="/login"
                  className="btn btn-outline-dark rounded-circle mx-1"
                >
                  <i className="fas fa-user" />
                </NavLink>
              )}
            </div>
          </div>

          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={
              menuOpen
                ? { height: "auto", opacity: 1 }
                : { height: 0, opacity: 0 }
            }
            className="overflow-hidden mt-3"
          >
            <div className="container mt-2">
              <div className="input-group rounded-pill bg-dark p-2 mb-3">
                <span className="input-group-text bg-dark border-0 text-white">
                  <i className="bi bi-search"></i>
                </span>
                <input
                  type="text"
                  className="form-control bg-dark text-white border-0 header-placeholder"
                  placeholder="Search Product..."
                />
                <button className="btn btn-light rounded-circle">
                  <i className="fas fa-search" />
                </button>
              </div>

              <div
                className="card card-body rounded-4 border-0 shadow-sm"
                style={{ backgroundColor: "#FFF5EB" }}
              >
                <ul className="nav flex-column flex-md-row justify-content-center text-center gap-2 gap-md-4">
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/"
                      >
                        Home
                      </NavLink>
                    </motion.div>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/allproduct"
                      >
                        All Product
                      </NavLink>
                    </motion.div>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/shopbycategory"
                      >
                        Shop by Categories
                      </NavLink>
                    </motion.div>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/newproduct"
                      >
                        New Product
                      </NavLink>
                    </motion.div>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/ourstory"
                      >
                        Our Story
                      </NavLink>
                    </motion.div>
                  </li>
                  <li className="nav-item">
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <NavLink
                        className="nav-link text-dark fw-semibold"
                        to="/contactus"
                      >
                        Contact
                      </NavLink>
                    </motion.div>
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>
        </div>
      </header>

      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default Header;
