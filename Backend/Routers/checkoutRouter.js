const express = require("express");
const router = express.Router();
const checkoutController = require("../Controllers/checkoutController");

// GET /api/checkout/:cartId
router.get("/:cartId", checkoutController.getCheckoutDetailsByCartId);

// POST /api/checkout/createCheckout
router.post("/createCheckout", checkoutController.createCheckout);
// POST /api/checkout/store
router.post("/store", checkoutController.storePaymentDetails);

router.get("/invoice/:orderId", checkoutController.generateInvoice);


module.exports = router;
