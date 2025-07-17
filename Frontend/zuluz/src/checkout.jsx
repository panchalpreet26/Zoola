import React, { useEffect, useState } from "react";
import axios from "axios";
import Header from "./header";
import { useNavigate } from "react-router-dom";
const API = process.env.REACT_APP_API_URL;

function Checkout() {
  const [checkoutData, setCheckoutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedMethod, setSelectedMethod] = useState("card");
  const [invoiceOrderId, setInvoiceOrderId] = useState(null); // ✅ New state
  const [checkoutId, setCheckoutId] = useState(null);

  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const cartId = sessionStorage.getItem("cartid");

  useEffect(() => {
    setFirstName(sessionStorage.getItem("firstname") || "");
    setLastName(sessionStorage.getItem("lastname") || "");
    setEmail(sessionStorage.getItem("email") || "");
    setPhone(sessionStorage.getItem("phone") || "");
    setAddress(sessionStorage.getItem("address") || "");
  }, []);

  const calculateSubtotalFromItems = (products) => {
    if (!Array.isArray(products)) return 0;
    return products.reduce((sum, item) => sum + (item.itemTotal || 0), 0);
  };

  const loadRazorpay = () => {
    const calculatedSubtotal = calculateSubtotalFromItems(
      checkoutData.products
    );
    const totalAmount =
      calculatedSubtotal +
      Number(checkoutData.shipping || 0) +
      Number(checkoutData.tax || 0);

    const userId = sessionStorage.getItem("userid");

    const pendingOrderData = {
      cartId,
      userId,
      firstName,
      lastName,
      email,
      phone,
      address,
      products: checkoutData.products,
      subtotal: calculatedSubtotal,
      shipping: checkoutData.shipping,
      tax: checkoutData.tax,
      total: totalAmount,
      paymentId: null,
      paymentStatus: "Pending",
    };

    let checkoutId = null;

    const options = {
      key: "rzp_test_v8YmrOPZwGRgde",
      amount: totalAmount * 100,
      currency: "INR",
      name: `${firstName} ${lastName}`,
      description: "Order Payment",
      handler: async function (response) {
        try {
          const successData = {
            ...pendingOrderData,
            paymentId: response.razorpay_payment_id,
            paymentStatus: "Success",
          };

          const checkoutRes = await axios.post(
            `${API}/api/checkout/store`,
            successData
          );
          checkoutId = checkoutRes.data.data._id;
          setCheckoutId(checkoutId);
          const orderRes = await axios.post(
            `${API}/api/order/create`,
            {
              checkoutId,
              userId,
              orderStatus: "Processing",
            }
          );

          let orderId = orderRes.data.data._id; // ✅ Correct

          setInvoiceOrderId(orderId); // ✅ Save order ID to show invoice download button

          alert("Payment successful and order stored!");
          // navigate("/"); // Optional redirect
        } catch (err) {
          console.error("Error storing success:", err);
          alert("Payment succeeded, but error storing order.");
        }
      },
      prefill: { name: `${firstName} ${lastName}`, email, contact: phone },
      notes: { address },
      theme: { color: "#3399cc" },
      modal: {
        ondismiss: async function () {
          try {
            const failedData = {
              ...pendingOrderData,
              paymentStatus: "Failed",
            };
            await axios.post(
              `${API}/api/checkout/store`,
              failedData
            );
            alert("Payment was not completed.");
          } catch (error) {
            console.error("Failed to store failed payment:", error);
          }
        },
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  useEffect(() => {
    const fetchCheckoutData = async () => {
      if (!cartId) return;

      try {
        const res = await axios.get(
          `${API}/api/checkout/${cartId}`
        );
        if (res.data.success) {
          setCheckoutData(res.data);
        }
      } catch (error) {
        console.error("Error fetching checkout data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCheckoutData();
  }, [cartId]);

  const renderOrderSummary = () => {
    if (loading) return <p>Loading...</p>;
    if (!checkoutData?.products?.length)
      return <p className="text-muted">Your cart is empty.</p>;

    const calculatedSubtotal = calculateSubtotalFromItems(
      checkoutData.products
    );
    const shipping = Number(checkoutData.shipping || 0);
    const tax = Number(checkoutData.tax || 0);
    const total = calculatedSubtotal + shipping + tax;

    return (
      <>
        <h5 className="mb-4">Order Summary</h5>
        {checkoutData.products.map((item, index) => (
          <div key={index} className="d-flex align-items-center mb-3">
            <img
              src={
                item.image
                  ? `${API}/uploads/${item.image}`
                  : "https://via.placeholder.com/60"
              }
              className="me-3 rounded"
              alt={item.name}
              width="60"
            />
            <div className="flex-grow-1">
              <div className="fw-semibold">{item.name}</div>
              <small className="text-muted">Qty: {item.quantity}</small>
            </div>
            <div>₹{item.itemTotal}</div>
          </div>
        ))}
        <hr />
        <div className="d-flex justify-content-between">
          <span className="text-muted">Subtotal</span>
          <span>₹{calculatedSubtotal}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Shipping</span>
          <span>₹{shipping}</span>
        </div>
        <div className="d-flex justify-content-between">
          <span className="text-muted">Tax</span>
          <span>₹{tax}</span>
        </div>
        <div className="d-flex justify-content-between fw-bold border-top pt-3 pb-2">
          <span>Total</span>
          <span>₹{total.toFixed(2)}</span>
        </div>
        <button className="btn btn-dark w-100 mt-3" onClick={loadRazorpay}>
          Place Order
        </button>

        {/* ✅ Show download invoice after successful payment */}
        {invoiceOrderId && (
          <a
            className="btn btn-outline-primary w-100 mt-2"
            href={`${API}/invoices/invoice-${checkoutId}.pdf`}
            target="_blank"
            rel="noopener noreferrer"
            download
          >
            Download Invoice
          </a>
        )}
      </>
    );
  };

  return (
    <div style={{ backgroundColor: "#FFF5EB", overflowX: "hidden" }}>
      <Header />
      <div className="container py-5">
        <h4 className="text-center fw-semibold mb-2">Checkout</h4>
        <p className="text-center text-muted">Home / Checkout</p>

        <div className="row mt-4 g-4">
          {/* Contact + Shipping */}
          <div className="col-12 col-lg-8">
            <div className="p-4 rounded bg-white shadow-sm text-start">
              <h5 className="mb-3">Contact Information</h5>
              <div className="row g-3">
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    className="form-control"
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    className="form-control"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    className="form-control"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    className="form-control"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                  />
                </div>
              </div>

              <h5 className="mt-4 mb-2">Shipping Address</h5>
              <textarea
                className="form-control"
                rows="3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>
          </div>

          {/* Order Summary */}
          <div className="col-12 col-lg-4">
            <div className="bg-white rounded shadow-sm p-4">
              {renderOrderSummary()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Checkout;
