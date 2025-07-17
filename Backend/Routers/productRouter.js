const express = require("express");
const multer = require("multer");
const productController = require("../Controllers/productController");
const path = require("path");
const fs = require("fs");

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const uploads = multer({ storage: storage });
router.post("/addproduct", uploads.single("image"), productController.store);
router.get("/productshow", productController.fetchall);
router.get("/productshowById/:id", productController.fetchOne);
router.delete("/productDelete/:id", productController.Delete);
router.put(
  "/productupdate/:id",
  uploads.single("image"),
  productController.update
);
router.get("/insta-products", productController.fetchInstagramProducts);
router.post("/recommendation", productController.recommendation);
router.post("/addreview", productController.addReview);
module.exports = router;
