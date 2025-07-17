const express = require("express");
const router = express.Router();
const multer = require("multer");

const bannerController = require("../Controllers/bannerController");
// const upload = require("../middleware/multer"); // use your existing multer setup
const path = require("path");
const fs = require("fs");

// const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });
// POST banner with image
router.post("/create",  uploads.single("image"),bannerController.createBanner);

// GET all banners
router.get("/all", bannerController.getBanners);

module.exports = router;
