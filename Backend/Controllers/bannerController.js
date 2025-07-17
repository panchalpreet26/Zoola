const Banner = require("../Models/bannerModel");

exports.createBanner = async (req, res) => {
  try {
    const image = req.file?.filename;
    const { title } = req.body;

    if (!image) return res.status(400).json({ message: "Image required" });

    const banner = new Banner({ image, title });
    await banner.save();
    res.status(201).json({ message: "Banner created", banner });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBanners = async (req, res) => {
  try {
    const banners = await Banner.find();
    res.json(banners);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
