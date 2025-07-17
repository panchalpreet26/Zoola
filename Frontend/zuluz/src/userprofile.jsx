import React, { useState, useEffect } from "react";
import axios from "axios";
import Header from "./header";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useLocation } from "react-router-dom";
import { motion , AnimatePresence } from "framer-motion";
const API = process.env.REACT_APP_API_URL;

function UserProfile() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "info");
  const [user, setUser] = useState({
    firstname: "",
    lastname: "",
    email: "",
    phone: "",
    password: "",
    address: "",
    image: "",
  });
  const [orders, setOrders] = useState([]);
  const [imagePreview, setImagePreview] = useState("");
  const [newImage, setNewImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = sessionStorage.getItem("userid");
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      axios
        .get(`${API}/api/user/user/${userId}`)
        .then((res) => {
          const fetchedUser = res.data.user;
          const storedAddress = sessionStorage.getItem("address");
          setUser({
            ...fetchedUser,
            password: "",
            address: storedAddress || fetchedUser.address || "",
          });
          setImagePreview(
            fetchedUser.image
              ? `${API}/uploads/${fetchedUser.image}`
              : ""
          );
        })
        .catch(() => toast.error("Failed to load user data"));

      axios
        .get(`${API}/api/order/user/${userId}`)
        .then((res) => {
          setOrders(res.data.orders || []);
        })
        .catch(() => toast.error("Failed to load order data"));
    }
  }, [userId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleUpdate = async () => {
    if (!userId) return;
    const formData = new FormData();
    for (const key in user) {
      if (key !== "image") {
        formData.append(key, user[key]);
      }
    }
    if (newImage) formData.append("image", newImage);

    try {
      setLoading(true);
      await axios.put(
        `${API}/api/user/update/${userId}`,
        formData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      toast.success("Profile updated successfully!");
      sessionStorage.setItem("address", user.address);
      setTimeout(() => navigate("/"), 2000);
    } catch {
      toast.error("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (orderId, newStatus) => {
    try {
      await axios.put(`${API}/api/order/status/${orderId}`, {
        orderStatus: newStatus,
      });
      toast.success(`Order ${newStatus.toLowerCase()} successfully!`);
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order
        )
      );
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };
  const containerVariant = {
    initial: { opacity: 0 },
    animate: { opacity: 1, transition: { duration: 0.6 } },
  };

  const sidebarVariant = {
    initial: { x: -60, opacity: 0 },
    animate: { x: 0, opacity: 1, transition: { delay: 0.2, duration: 0.5 } },
  };

  const contentVariant = {
    initial: { y: 40, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { delay: 0.4, duration: 0.5 } },
  };

  const cardVariant = {
    initial: { y: 30, opacity: 0 },
    animate: { y: 0, opacity: 1, transition: { duration: 0.4 } },
  };

  const fadeVariant = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
    transition: { duration: 0.3 },
  };
  const renderOrderStatus = (status) => {
    const steps = [
      "Ordered",
      "Packed",
      "Shipped",
      "Out for Delivery",
      "Delivered",
    ];
    const currentIndex = steps.indexOf(status);
    return (
      <div className="d-flex flex-wrap justify-content-between gap-2 my-3">
        {steps.map((step, i) => {
          const isCompleted = i < currentIndex;
          const isCurrent = i === currentIndex;

          let circleClass = "bg-secondary";
          let icon = "";

          if (isCompleted) {
            circleClass = "bg-success";
            icon = "✓";
          } else if (isCurrent) {
            if (step === "Delivered") {
              circleClass = "bg-info";
              icon = "✓";
            } else if (step === "Out for Delivery") {
              circleClass = "bg-dark";
            } else {
              circleClass = "bg-warning";
            }
          }

          return (
            <div
              key={i}
              className="d-flex flex-column align-items-center"
              style={{ flex: "1 1 70px" }}
            >
              <div
                className={`rounded-circle ${circleClass} mb-1 d-flex align-items-center justify-content-center`}
                style={{ width: "28px", height: "28px", color: "#fff" }}
              >
                {icon}
              </div>
              <small
                className="text-center"
                style={{ fontSize: "11px", wordBreak: "break-word" }}
              >
                {step}
              </small>
              {i !== steps.length - 1 && (
                <div
                  className="w-100 mt-2"
                  style={{
                    height: "2px",
                    backgroundColor: isCompleted ? "#28a745" : "#ccc",
                  }}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <motion.div
      style={{ backgroundColor: "#FFF5EB", minHeight: "100vh" }}
      variants={containerVariant}
      initial="initial"
      animate="animate"
    >
      <Header />
      <ToastContainer position="top-center" autoClose={3000} />
      <div className="container py-4">
        <div className="row g-4">
          {/* Sidebar */}
          <div className="col-12 col-md-4 col-lg-3">
            <motion.div
              className="card text-center shadow-sm border-0 bg-light"
              variants={sidebarVariant}
              initial="initial"
              animate="animate"
            >
              <div className="card-body">
                <img
                  src={imagePreview || "https://via.placeholder.com/80"}
                  className="rounded-circle img-fluid mb-2"
                  alt="Profile"
                  style={{ maxWidth: "80px", height: "auto" }}
                />
                <h6 className="fw-bold">Hi, {user.firstname || "User"}</h6>
                <div className="d-grid gap-2 mt-3">
                  <button
                    className={`btn btn-sm ${
                      activeTab === "info" ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setActiveTab("info")}
                  >
                    My Information
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeTab === "orders" ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setActiveTab("orders")}
                  >
                    My Orders
                  </button>
                  <button
                    className={`btn btn-sm ${
                      activeTab === "history" ? "btn-dark" : "btn-outline-dark"
                    }`}
                    onClick={() => setActiveTab("history")}
                  >
                    Order History
                  </button>
                  <button
                    className="btn btn-outline-dark btn-sm text-danger mt-2"
                    onClick={() => {
                      sessionStorage.clear();
                      navigate("/login");
                    }}
                  >
                    <i className="bi bi-box-arrow-left me-1" /> Log Out
                  </button>
                </div>
              </div>
            </motion.div>
          </div>

         <motion.div
  className="col-12 col-md-8 col-lg-9"
  style={{ maxHeight: "600px", overflowY: "auto" }}
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.5 }}
>
  <AnimatePresence mode="wait">
    {activeTab === "info" && (
      <motion.div
        key="info"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="card border-0 shadow-sm bg-light"
      >
        <div className="card-body">
          <h5 className="mb-3 fw-bold">Edit Profile</h5>
          <div className="row g-3">
            {["firstname", "lastname", "phone", "email"].map((name, i) => (
              <div className="col-md-6" key={i}>
                <label className="form-label">
                  {name.charAt(0).toUpperCase() + name.slice(1)}
                </label>
                <input
                  type="text"
                  name={name}
                  className="form-control"
                  value={user[name]}
                  onChange={handleChange}
                />
              </div>
            ))}
            <div className="col-md-6">
              <label className="form-label">Password</label>
              <input
                type="password"
                name="password"
                className="form-control"
                value={user.password}
                onChange={handleChange}
                placeholder="New password"
              />
            </div>
            <div className="col-md-6">
              <label className="form-label">Profile Image</label>
              <input
                type="file"
                className="form-control"
                onChange={handleImageChange}
                accept="image/*"
              />
            </div>
            <div className="col-12">
              <label className="form-label">Address</label>
              <textarea
                name="address"
                rows="3"
                className="form-control"
                value={user.address}
                onChange={handleChange}
              ></textarea>
            </div>
            <div className="d-flex justify-content-center">
              <button
                className="btn btn-outline-dark btn-sm mt-2"
                onClick={handleUpdate}
                disabled={loading}
              >
                {loading ? "Updating..." : "Update Profile"}
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    )}

    {activeTab === "orders" && (
      <motion.div
        key="orders"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="card border-0 shadow-sm bg-light"
      >
        <div className="card-body">
          <h5 className="mb-4 fw-bold">My Orders</h5>
          {orders.length === 0 ? (
            <p className="text-muted">You have no orders yet.</p>
          ) : (
            orders
              .filter(
                (order) =>
                  order.orderStatus !== "Cancelled" &&
                  order.orderStatus !== "Returned"
              )
              .map((order, index) => (
                <motion.div
                  key={index}
                  className="border rounded p-3 mb-4 bg-white"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Order Details */}
                  <div className="row mb-2">
                    <div className="col-md-4">
                      <strong>Order ID:</strong> {order._id}
                    </div>
                    <div className="col-md-4">
                      <strong>Payment:</strong>{" "}
                      {order.checkoutId?.paymentStatus}
                    </div>
                    <div className="col-md-4">
                      <strong>Placed:</strong>{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {renderOrderStatus(order.orderStatus)}

                  <div className="mb-2">
                    <strong>Shipping Address:</strong>
                    <br />
                    {user.address}
                  </div>

                  <div className="mb-2">
                    <strong>Products:</strong>
                    {order.checkoutId?.products?.map((item, idx) => (
                      <div
                        key={idx}
                        className="d-flex align-items-center mt-2 flex-wrap"
                      >
                        <img
                          src={
                            item.image
                              ? `${API}/uploads/${item.image}`
                              : "https://via.placeholder.com/50"
                          }
                          alt={item.name}
                          width={50}
                          height={50}
                          className="rounded me-2 mb-2"
                        />
                        <div>
                          <div className="fw-semibold">{item.name}</div>
                          <div className="text-muted">Qty: {item.quantity}</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-flex justify-content-between align-items-center mt-2">
                    <div>
                      <strong>Total:</strong> ₹
                      {order.checkoutId?.totalAmount}
                    </div>
                    <div>
                      {order.orderStatus === "Shipped" && (
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={() => handleAction(order._id, "Cancelled")}
                        >
                          Cancel Order
                        </button>
                      )}
                      {order.orderStatus === "Delivered" && (
                        <button
                          className="btn btn-outline-warning btn-sm"
                          onClick={() => {
                            const confirmReturn = window.confirm(
                              "Return Policy:\n\n✔ Product must be in original condition\n✔ Return valid within 7 days of delivery\n✔ Refund will be processed after inspection\n\nDo you want to continue?"
                            );
                            if (confirmReturn) {
                              handleAction(order._id, "Returned");
                            } else {
                              toast.error(
                                "Return cancelled! Product will not be returned."
                              );
                            }
                          }}
                        >
                          Return Order
                        </button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))
          )}
        </div>
      </motion.div>
    )}

    {activeTab === "history" && (
      <motion.div
        key="history"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ duration: 0.4 }}
        className="card border-0 shadow-sm bg-light"
      >
        <div className="card-body">
          <h5 className="mb-4 fw-bold">Order History</h5>
          {orders.length === 0 ? (
            <p className="text-muted">No past orders found.</p>
          ) : (
            <div className="table-responsive-sm">
              <table className="table table-striped">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Order ID</th>
                    <th>Date</th>
                    <th>Payment</th>
                    <th>Status</th>
                    <th>Total</th>
                    <th>Products</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order, index) => (
                    <tr key={order._id}>
                      <td>{index + 1}</td>
                      <td>{order._id}</td>
                      <td>{new Date(order.createdAt).toLocaleString()}</td>
                      <td>{order.checkoutId?.paymentStatus}</td>
                      <td>
                        <span
                          className={`badge bg-${
                            order.orderStatus === "Cancelled"
                              ? "danger"
                              : order.orderStatus === "Returned"
                              ? "warning"
                              : "secondary"
                          }`}
                        >
                          {order.orderStatus}
                        </span>
                      </td>
                      <td>₹{order.checkoutId?.totalAmount}</td>
                      <td>
                        <ul className="list-unstyled mb-0">
                          {order.checkoutId?.products?.map((item, idx) => (
                            <li key={idx}>
                              {item.name} (x{item.quantity})
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </motion.div>
    )}
  </AnimatePresence>
</motion.div>

        </div>
      </div>
    </motion.div>
  );
}

export default UserProfile;
