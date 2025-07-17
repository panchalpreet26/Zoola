const NewProduct = require("../Models/newproduct.Model");
// const NewProduct = require("../models/newProductModel");

// CREATE
exports.createProduct = async (req, res) => {
  try {
    const { title, description } = req.body;
    const images = req.files.map((file) => file.filename);

    const product = new NewProduct({ title, description, images });
    await product.save();

    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// READ ALL
exports.getAllProducts = async (req, res) => {
  try {
    const products = await NewProduct.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { ...req.body };

    if (req.files && req.files.length > 0) {
      updates.images = req.files.map((file) => file.filename);
    }

    const updated = await NewProduct.findByIdAndUpdate(id, updates, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE
exports.deleteProduct = async (req, res) => {
  try {
    await NewProduct.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
