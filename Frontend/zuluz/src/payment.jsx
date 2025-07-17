import React from "react";

const Pay2 = () => {
  const loadRazorpay = () => {
    const options = {
      key: "rzp_test_v8YmrOPZwGRgde", // Replace with your Razorpay Key ID
      amount: 50000, // Amount is in the smallest currency unit (e.g., 50000 paise = ₹500)
      currency: "INR",
      name: "Praxware Technologies",
      description: "Test Transaction",
      image: "https://your-logo-url.com/logo.png", // optional
      handler: function (response) {
        alert("Payment Successful!");
        console.log("Razorpay Response:", response);
        // You can send this response to the backend to verify payment
      },
      prefill: {
        name: "Hitesh Kachhela",
        email: "kachhelahitesh@gmail.com",
        contact: "9638758299",
      },
      notes: {
        address: "Corporate Office",
      },
      theme: {
        color: "#3399cc",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div style={{ textAlign: "center", marginTop: "50px" }}>
      <h2>Pay with Razorpay</h2>
      <button
        onClick={loadRazorpay}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        Pay ₹500
      </button>
    </div>
  );
};

export default Pay2;
