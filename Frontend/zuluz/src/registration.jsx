import React, { useState } from "react";
import Header from "./header";
import { NavLink, useNavigate } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";
const API = process.env.REACT_APP_API_URL;


export default function Registration() {
  const [firstname, setFirstname] = useState("");
  const [lastname, setLastname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [image, setImage] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("firstname", firstname);
    formData.append("lastname", lastname);
    formData.append("email", email);
    formData.append("phone", phone);
    formData.append("password", password);
    formData.append("address", address);
    if (image) formData.append("image", image);

    try {
      await axios.post(`${API}/api/user/usersignup`, formData);
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      console.error("Registration failed:", err);
      toast.error("Registration failed. Please try again.");
    }
  };

  return (
    <div style={{ backgroundColor: "#FFF5EB" }}>
      <div className="container-fluid min-vh-100 d-flex align-items-center py-4">
        <div className="row w-100">
          {/* Left - Form Section with Animation */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="col-12 col-md-6 d-flex align-items-center justify-content-center"
          >
            <div className="w-100 px-4" style={{ maxWidth: "450px" }}>
              <div className="text-center mb-4">
                <img
                  src="/image/zulaslogo.png"
                  alt="Zulas Logo"
                  style={{ height: "60px", objectFit: "contain" }}
                />
              </div>

              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {[
                  { label: "First Name", value: firstname, setter: setFirstname },
                  { label: "Last Name", value: lastname, setter: setLastname },
                  { label: "Email", value: email, setter: setEmail, type: "email" },
                  { label: "Phone", value: phone, setter: setPhone },
                ].map((field, i) => (
                  <motion.div
                    key={i}
                    className="mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <label className="form-label">{field.label}</label>
                    <input
                      type={field.type || "text"}
                      className="form-control"
                      placeholder={`Enter ${field.label}`}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      required
                    />
                  </motion.div>
                ))}

                {/* Password */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                >
                  <label className="form-label">Password</label>
                  <div className="input-group">
                    <input
                      type={showPassword ? "text" : "password"}
                      className="form-control"
                      placeholder="Enter Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                    <span
                      className="input-group-text"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      <i className={`bi ${showPassword ? "bi-eye" : "bi-eye-slash"}`}></i>
                    </span>
                  </div>
                </motion.div>

                {/* Address */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <label className="form-label">Address</label>
                  <textarea
                    className="form-control"
                    placeholder="Enter Address"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                  ></textarea>
                </motion.div>

                {/* Upload Image */}
                <motion.div
                  className="mb-3"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.9 }}
                >
                  <label className="form-label">Upload Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => setImage(e.target.files[0])}
                  />
                </motion.div>

                {/* Button */}
                <motion.div
                  className="d-grid"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1 }}
                >
                  <button type="submit" className="btn btn-dark">
                    Sign Up
                  </button>
                </motion.div>
              </form>

              <div className="text-center mt-3">
                <small>
                  Already have an account?{" "}
                  <NavLink to="/login" className="text-dark text-decoration-none">
                    Log in
                  </NavLink>
                </small>
              </div>
            </div>
          </motion.div>

          {/* Right - Image Section with Zoom In */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="col-md-6 d-none d-md-flex align-items-center p-0"
          >
            <img
              src="https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=800&q=80"
              alt="Visual"
              className="img-fluid vh-100 w-100 object-fit-cover"
            />
          </motion.div>
        </div>
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}
