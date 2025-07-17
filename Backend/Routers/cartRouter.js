const express = require("express");
const router = express.Router();
const cartController = require("../Controllers/cartController");

router.post("/addtocart", cartController.addToCart);
router.get("/fetchcart/:userId", cartController.getCartByUserId);
router.patch("/update", cartController.updateCartQuantity);
router.delete("/remove/:userId/:productId", cartController.deleteFromCart);


module.exports = router;
