const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");
const {
  createProduct,
  getAllProducts,
  updateProduct,
  deleteProduct,
} = require("../Controllers/newproductController");

// Image upload setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});
const upload = multer({ storage });

router.post("/newproductadd", upload.array("images",3), createProduct);
router.get("/newproductshow", getAllProducts);
router.put("/newproductupdate/:id", upload.array("images",3), updateProduct);
router.delete("/newproductdelete/:id", deleteProduct);

module.exports = router;
