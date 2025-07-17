const express = require("express");
const router = express.Router();
const wishlistController = require("../Controllers/wishlistController");

router.post("/addtowishlist", wishlistController.addToWishlist);
router.get("/getwishlistbyuserid/:userId", wishlistController.getWishlistByUser);
router.delete("/deletewishlist/:id", wishlistController.removeFromWishlist);

module.exports = router;
