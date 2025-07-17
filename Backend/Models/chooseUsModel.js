const mongoose = require("mongoose");

const chooseUsSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: String,
  image: String,
}, { timestamps: true });

module.exports = mongoose.model("ChooseUs", chooseUsSchema);
