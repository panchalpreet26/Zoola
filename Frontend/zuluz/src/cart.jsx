import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import { NavLink } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { motion } from "framer-motion";

function CartPage() {
  const [cart, setCart] = useState(null);
  const [subtotal, setSubtotal] = useState(0);
  const [shipping, setShipping] = useState(0);
  const [tax, setTax] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const API = process.env.REACT_APP_API_URL;

  const userId = sessionStorage.getItem("userid");

  const fetchCart = async () => {
    if (!userId) return alert("Please login first");

    try {
      const res = await axios.get(
        `${API}/api/cart/fetchcart/${userId}`
      );

      if (res.data.success) {
        const cartData = res.data.cart;
        setCart(cartData);

        if (!cartData.products || !Array.isArray(cartData.products)) {
          setSubtotal(0);
          setShipping(0);
          setTax(0);
          setTotalAmount(0);
          return;
        }

        const totalPrice = cartData.products.reduce((acc, item) => {
          const price = Number(item.productId?.newprice) || 0;
          const qty = item.quantity ?? 1;
          return acc + price * qty;
        }, 0);

        const TAX_RATE = 0.05;
        const SHIPPING_RATE = 0.02;
        const taxAmount = totalPrice * TAX_RATE;
        const shippingCost = totalPrice * SHIPPING_RATE;
        const total = totalPrice + taxAmount + shippingCost;

        setSubtotal(totalPrice);
        sessionStorage.setItem("subtotal", totalPrice.toString());
        setShipping(shippingCost);
        setTax(taxAmount);
        setTotalAmount(total);

        const categories = cartData.products.map((p) => p.productId.categories);
        const uniqueCategories = [...new Set(categories)];
        const productIds = cartData.products.map((p) => p.productId._id);

        const recommendationRes = await axios.post(
          `${API}/api/product/recommendation`,
          {
            categories: uniqueCategories,
            excludeIds: productIds,
          }
        );

        if (recommendationRes.data.success) {
          setRecommendedProducts(recommendationRes.data.products);
        }
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId, action) => {
    try {
      await axios.patch(`${API}/api/cart/update`, {
        userId,
        productId,
        action,
      });
      fetchCart();
    } catch (err) {
      console.error("Failed to update quantity", err);
    }
  };

  const removeItem = async (productId) => {
    toast.info(
      ({ closeToast }) => (
        <div>
          <p>Remove this item from your cart?</p>
          <div className="d-flex justify-content-end gap-2 mt-2">
            <button
              className="btn btn-sm btn-danger"
              onClick={async () => {
                try {
                  await axios.delete(
                    `${API}/api/cart/remove/${userId}/${productId}`
                  );
                  toast.dismiss();
                  toast.success("Item removed from cart");
                  fetchCart();
                } catch (err) {
                  console.error("Failed to remove item", err);
                  toast.dismiss();
                  toast.error("Error removing item");
                }
              }}
            >
              Confirm
            </button>
            <button
              className="btn btn-sm btn-secondary"
              onClick={() => toast.dismiss()}
            >
              Cancel
            </button>
          </div>
        </div>
      ),
      {
        position: "top-center",
        autoClose: false,
        closeOnClick: false,
        draggable: false,
        closeButton: false,
      }
    );
  };

  const handlePlaceOrder = async () => {
    const cartId = cart?._id;
    if (!cartId) return alert("Cart ID missing!");

    try {
      const res = await axios.post(
        `${API}/api/checkout/createCheckout`,
        {
          cartId,
          subtotal,
          shipping,
          tax,
          totalAmount,
        }
      );

      if (res.data.success) {
        sessionStorage.setItem("cartid", cartId);
        toast.success("Order placed successfully!");
        window.location.href = "/checkout";
      } else {
        alert("Failed to place order.");
      }
    } catch (error) {
      console.error("Order creation failed:", error);
      alert("Error placing order.");
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  if (loading) return <p className="text-center py-5">Loading cart...</p>;

  return (
    <div style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}>
      <Header />
      <div className="container-fluid py-5 px-3">
        <h4 className="text-center">Cart</h4>
        <p className="text-center text-muted">Home / Cart</p>

        <div className="row mt-4 g-4">
          {/* Cart Items */}
          <div className="col-12 col-lg-8">
            <h5 className="fw-bold mb-3">Cart Items</h5>
            {cart?.products?.length > 0 ? (
              cart.products.map((item, index) => (
                <motion.div
                  key={index}
                  className="border rounded p-3 mb-3 shadow-sm bg-white"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.3 }}
                >
                  <div className="row g-3 align-items-center">
                    <div className="col-3 col-sm-2">
                      <img
                        src={`${API}/uploads/${item.productId.image}`}
                        alt={item.productId.name}
                        className="img-fluid rounded"
                        style={{ height: "80px", objectFit: "cover" }}
                      />
                    </div>
                    <div className="col-9 col-sm-4">
                      <strong className="d-block">{item.productId.name}</strong>
                      <small className="text-muted d-block text-truncate">
                        {item.productId.description}
                      </small>
                    </div>
                    <div className="col-12 col-sm-3">
                      <div className="input-group input-group-sm w-100">
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.productId._id, "dec")
                          }
                        >
                          -
                        </button>
                        <input
                          type="text"
                          className="form-control text-center"
                          value={item.quantity}
                          readOnly
                        />
                        <button
                          className="btn btn-outline-secondary"
                          onClick={() =>
                            updateQuantity(item.productId._id, "inc")
                          }
                        >
                          +
                        </button>
                      </div>
                    </div>
                    <div className="col-6 col-sm-2 text-end">
                      <span>₹{item.productId.newprice}</span>
                    </div>
                    <div className="col-6 col-sm-1 text-end">
                      <button
                        className="btn btn-sm btn-outline-danger"
                        onClick={() => removeItem(item.productId._id)}
                      >
                        <i className="fas fa-trash" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-muted text-center">No products in cart.</div>
            )}
            <div className="mt-3">
              <NavLink
                to="/allproduct"
                className="btn btn-outline-dark d-inline-flex align-items-center"
                style={{ transition: "all 0.2s ease-in-out" }}
                onMouseOver={(e) =>
                  (e.currentTarget.style.transform = "scale(1.05)")
                }
                onMouseOut={(e) =>
                  (e.currentTarget.style.transform = "scale(1)")
                }
              >
                <i className="fas fa-arrow-left me-2" />
                Continue Shopping
              </NavLink>
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-4">
            <motion.div
              className="card shadow-sm"
              initial={{ x: 100, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            >
              <div className="card-body">
                <h6 className="card-title fw-bold">Order Summary</h6>
                <div className="d-flex justify-content-between">
                  <span>Subtotal</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Shipping (2%)</span>
                  <span>₹{shipping.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax (5%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between fw-bold mb-3">
                  <span>Total</span>
                  <span>₹{totalAmount.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-dark w-100"
                  onClick={handlePlaceOrder}
                >
                  Proceed to Checkout
                </button>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Recommended Products */}
        {recommendedProducts.length > 0 && (
          <div className="mt-5">
            <h5 className="mb-3">Recommended for You</h5>
            <div className="row g-3">
              {recommendedProducts.map((product, index) => (
                <motion.div
                  className="col-6 col-md-4 col-lg-3"
                  key={product._id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{
                    delay: index * 0.1,
                    duration: 0.5,
                    ease: "easeOut",
                  }}
                >
                  <div className="card h-100 shadow-sm">
                    <img
                      src={`${API}/uploads/${product.image}`}
                      alt={product.name}
                      className="card-img-top"
                      style={{ height: "200px", objectFit: "cover" }}
                    />
                    <div className="card-body text-center">
                      <h6 className="card-title">{product.name}</h6>
                      <p className="text-muted">₹{product.newprice}</p>
                      <button
                        className="btn btn-sm btn-dark"
                        onClick={async () => {
                          try {
                            await axios.post(
                              `${API}/api/cart/addtocart`,
                              {
                                userId,
                                productId: product._id,
                                quantity: 1,
                              }
                            );
                            fetchCart();
                            toast.success("Product added to cart!");
                          } catch (err) {
                            toast.error("Error adding to cart");
                          }
                        }}
                      >
                        Add to Cart
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
}

export default CartPage;
