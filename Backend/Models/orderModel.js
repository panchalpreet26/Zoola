const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  checkoutId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Checkout",
    required: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  orderStatus: {
  type: String,
  enum: ["Processing", "Shipped", "Delivered", "Cancelled", "Returned"], // Added "Returned"
  default: "Processing",
},

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Order", orderSchema);
