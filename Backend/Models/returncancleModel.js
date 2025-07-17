const mongoose = require("mongoose");

const returnCancelSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    orderId: { type: String, required: true },
    status: { type: String, enum: ["Cancelled", "Returned"], required: true },
    reason: { type: String },
    amount: { type: Number },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ReturnCancel", returnCancelSchema);
