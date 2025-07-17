import React, { useState } from "react";
import Header from "./header";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { auth, provider, signInWithPopup } from "./firebaseconfig";
import { motion } from "framer-motion";
const API = process.env.REACT_APP_API_URL;


export default function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.warning("Please enter both email and password.");
      return;
    }

    try {
      const response = await axios.post(
        `${API}/api/user/userlogin`,
        {
          email,
          password,
        }
      );

      const result = response.data;

      if (result.success) {
        sessionStorage.setItem("firstname", result.user.firstname);
        sessionStorage.setItem("lastname", result.user.lastname);
        sessionStorage.setItem("email", result.user.email);
        sessionStorage.setItem("address", result.user.address);
        sessionStorage.setItem("userid", result.user._id);
        sessionStorage.setItem("phone", result.user.phone);

        toast.success("Login Successful");
        setTimeout(() => navigate("/"), 3000);
      } else {
        toast.error("Login failed.");
      }
    } catch (error) {
      toast.error(
        "Login Failed: " + (error.response?.data?.message || "Server Error")
      );
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;

      const response = await axios.post(
        `${API}/api/user/firebase-login`,
        {
          email: user.email,
          firstname: user.displayName?.split(" ")[0] || "User",
          lastname: user.displayName?.split(" ")[1] || "",
          image: user.photoURL,
        }
      );

      const savedUser = response.data.user;

      sessionStorage.setItem("firstname", savedUser.firstname);
      sessionStorage.setItem("lastname", savedUser.lastname);
      sessionStorage.setItem("email", savedUser.email);
      sessionStorage.setItem("userid", savedUser._id);
      sessionStorage.setItem("image", user.photoURL);
      sessionStorage.setItem("googleLogin", "true"); // ✅ Set flag for Google login

      toast.success("Google Login Successful");
      setTimeout(() => navigate("/"), 3000);
    } catch (error) {
      toast.error("Google Sign-in failed");
      console.error(error);
    }
  };

  return (
    <div style={{ backgroundColor: "#FFF5EB" }}>
      <div className="container-fluid min-vh-100 d-flex align-items-center py-5">
        <div className="row w-100">
          {/* Left Form Section */}
          <motion.div
            className="col-12 col-md-6 d-flex align-items-center justify-content-center"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          >
            <motion.div
              className="w-100 px-4"
              style={{ maxWidth: "400px" }}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
            >
              <div className="text-center mb-4">
                <motion.img
                  src="/image/zulaslogo.png"
                  alt="Zulas Logo"
                  style={{
                    height: "60px",
                    width: "auto",
                    objectFit: "contain",
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                />
              </div>

              <form onSubmit={handleLogin}>
                <div className="mb-3">
                  <label>Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter Email"
                  />
                </div>
                <div className="mb-3">
                  <label>Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter Password"
                  />
                </div>
                <button className="btn btn-dark w-100" type="submit">
                  Log In
                </button>
              </form>

              <div className="text-center mt-3 mb-2">OR</div>
              <button
                onClick={handleGoogleLogin}
                className="btn btn-outline-dark w-100"
              >
                Continue with Gmail
              </button>

              <div className="text-center mt-3">
                <small>
                  Don't have an account?{" "}
                  <NavLink
                    to="/registration"
                    className="text-dark text-decoration-none"
                  >
                    Sign up
                  </NavLink>
                </small>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Image Section */}
          <motion.div
            className="col-md-6 d-none d-md-block p-0"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
              className="img-fluid vh-100 w-100 object-fit-cover"
              alt="Login Visual"
            />
          </motion.div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
