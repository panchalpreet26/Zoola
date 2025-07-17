const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const contentController = require("../Controllers/contentController");

// Multer config
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});
const upload = multer({ storage });

// Routes
router.post("/contentadd", upload.single("image"), contentController.createContent);
router.get("/contentshow", contentController.getAllContent);
router.put("/contentupdate/:id", upload.single("image"), contentController.updateContent);
router.delete("/contentdelete/:id", contentController.deleteContent);

module.exports = router;
