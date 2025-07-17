const express = require("express");
const router = express.Router();
const multer = require("multer");
const chooseUsController = require("../Controllers/chooseUsController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/chooseUsshow", chooseUsController.getAllReasons);
router.post("/chooseUsadd", upload.single("image"), chooseUsController.createReason);
router.put("/chooseUsupdate/:id", upload.single("image"), chooseUsController.updateReason);
router.delete("/chooseUsdelete/:id", chooseUsController.deleteReason);

module.exports = router;
