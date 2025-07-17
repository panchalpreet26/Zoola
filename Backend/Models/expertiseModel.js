const mongoose = require("mongoose");

const expertiseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("Expertise", expertiseSchema);
