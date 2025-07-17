const ChooseUs = require("../Models/chooseUsModel");

exports.getAllReasons = async (req, res) => {
  try {
    const data = await ChooseUs.find();
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.createReason = async (req, res) => {
  try {
    const { title, description } = req.body;
    const image = req.file?.path || "";

    const reason = new ChooseUs({ title, description, image });
    const saved = await reason.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateReason = async (req, res) => {
  try {
    const { id } = req.params;
    const updated = {
      title: req.body.title,
      description: req.body.description,
    };
    if (req.file) updated.image = req.file.path;

    const data = await ChooseUs.findByIdAndUpdate(id, updated, { new: true });
    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteReason = async (req, res) => {
  try {
    await ChooseUs.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
