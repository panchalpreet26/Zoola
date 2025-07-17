const mongoose = require("mongoose");

const newProductSchema = new mongoose.Schema({
  title: String,
  description: String,
  images: [String], // Now supports multiple images
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("NewProduct", newProductSchema);
