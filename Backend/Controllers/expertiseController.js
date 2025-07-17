const Expertise = require("../Models/expertiseModel");

exports.getAllExpertise = async (req, res) => {
  try {
    const data = await Expertise.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createExpertise = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.path || "";

    const newExpertise = new Expertise({ title, description, image });
    const saved = await newExpertise.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateExpertise = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = {
      title: req.body.title,
      description: req.body.description,
    };
    if (req.file) updated.image = req.file.path;

    const data = await Expertise.findByIdAndUpdate(id, updated, { new: true });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteExpertise = async (req, res) => {
  try {
    await Expertise.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
