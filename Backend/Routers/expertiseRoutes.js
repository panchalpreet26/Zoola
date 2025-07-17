const express = require("express");
const router = express.Router();
const multer = require("multer");
const expertiseController = require("../Controllers/expertiseController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

router.get("/expertiseshow", expertiseController.getAllExpertise);
router.post("/expertiseadd", upload.single("image"), expertiseController.createExpertise);
router.put("/expertiseupdate/:id", upload.single("image"), expertiseController.updateExpertise);
router.delete("/expertisedelete/:id", expertiseController.deleteExpertise);

module.exports = router;
