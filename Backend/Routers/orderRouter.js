const express = require("express");
const router = express.Router();
const orderController = require("../Controllers/orderController");

router.post("/create", orderController.createOrder);
router.get("/user/:userId", orderController.getOrdersByUser); // New route
router.get("/all", orderController.getAllOrders); // Admin use
router.put("/status/:id", orderController.updateOrderStatus); // Admin update
// router.post("/update-status", orderController.updateOrderStatus);
router.get("/invoice/:orderId", orderController.generateInvoice);



module.exports = router;
