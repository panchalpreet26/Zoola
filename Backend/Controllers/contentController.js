const Content = require("../Models/contentModel");

// Create
exports.createContent = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.path || "";

    const content = new Content({ title, description, image });
    const saved = await content.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Read all
exports.getAllContent = async (req, res) => {
  try {
    const data = await Content.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update
exports.updateContent = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description } = req.body;
    const image = req.file?.path;

    const updatedData = { title, description };
    if (image) updatedData.image = image;

    const updated = await Content.findByIdAndUpdate(id, updatedData, { new: true });
    res.status(200).json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete
exports.deleteContent = async (req, res) => {
  try {
    await Content.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Content deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
