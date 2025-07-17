const Order = require("../Models/orderModel");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const path = require("path");
const moment = require("moment");

const generateInvoice = async (req, res) => {
  const { orderId } = req.params;

  try {
    const order = await Order.findById(orderId)
      .populate({
        path: "checkoutId",
        populate: {
          path: "products.productId",
        },
      })
      .populate("userId");

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    const checkout = order.checkoutId;

    const doc = new PDFDocument();
    const invoicePath = path.join(
      __dirname,
      `../invoices/invoice-${orderId}.pdf`
    );

    // ✅ Ensure invoices directory exists
    if (!fs.existsSync(path.dirname(invoicePath))) {
      fs.mkdirSync(path.dirname(invoicePath), { recursive: true });
    }

    const writeStream = fs.createWriteStream(invoicePath);
    doc.pipe(writeStream);

    // Header
    doc.fontSize(20).text("INVOICE", { align: "center" });
    doc.moveDown();

    // Customer Info
    doc.fontSize(12).text(`Invoice #: ${order._id}`);
    doc.text(`Date: ${moment(order.createdAt).format("DD-MM-YYYY hh:mm A")}`);
    doc.text(`Customer: ${order.userId?.name || "N/A"}`);
    doc.text(`Email: ${order.userId?.email || "N/A"}`);
    doc.moveDown();

    // Product Details
    doc.fontSize(14).text("Products:", { underline: true });
    doc.moveDown();

    checkout.products.forEach((item, index) => {
      const product = item.productId;
      if (product) {
        doc.text(
          `${index + 1}. ${product.name} - ₹${product.newprice} × ${
            item.quantity
          } = ₹${product.newprice * item.quantity}`
        );
      }
    });

    doc.moveDown();
    doc.fontSize(12).text(`Subtotal: ₹${checkout.subtotal}`);
    doc.text(`Shipping: ₹${checkout.shipping}`);
    doc.text(`Tax: ₹${checkout.tax}`);
    doc.text(`Total Amount: ₹${checkout.totalAmount}`);
    doc.text(`Payment Method: ${checkout.paymentMethod}`);
    doc.text(`Payment Status: ${checkout.paymentStatus}`);
    doc.moveDown();
    doc.text(`Generated on: ${moment().format("DD-MM-YYYY hh:mm A")}`);

    doc.end();

    writeStream.on("finish", () => {
      res.status(200).json({
        message: "Invoice generated",
        url: `/invoices/invoice-${orderId}.pdf`,
      });
    });
  } catch (error) {
    console.error("Invoice generation error:", error); // Already exists
    res.status(500).json({
      message: "Failed to generate invoice",
      error: error.message, // 👈 Add this
    });
  }
};

const ReturnCancel = require("../Models/returncancleModel");
const createOrder = async (req, res) => {
  try {
    const { checkoutId, userId, orderStatus } = req.body;

    if (!checkoutId || !userId) {
      return res.status(400).json({
        success: false,
        message: "Checkout ID and User ID are required",
      });
    }

    const newOrder = new Order({
      checkoutId,
      userId,
      orderStatus: orderStatus || "Processing", // avoid hardcoding invalid enum like "Success"
    });

    await newOrder.save();
    res
      .status(201)
      .json({ success: true, message: "Order created", data: newOrder });
  } catch (error) {
    console.error("Order creation error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .populate("checkoutId")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// In orderController.js
const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate({
        path: "checkoutId", // this will give you totalAmount and products
      })
      .populate("userId") // optional: get user firstname/lastname
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, orders });
  } catch (err) {
    console.error("Failed to get orders", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.id; // <-- from URL param
    const { orderStatus } = req.body; // <-- from body

    const order = await Order.findById(orderId).populate("checkoutId");

    if (!order) return res.status(404).json({ error: "Order not found" });

    order.orderStatus = orderStatus;
    await order.save();

    // Optional logic for cancelled/returned
    if (["Cancelled", "Returned"].includes(orderStatus)) {
      await ReturnCancel.create({
        userId: order.userId,
        orderId,
        status: orderStatus,
        reason:
          orderStatus === "Cancelled"
            ? "User cancelled before delivery"
            : "User requested return",
        amount: order.checkoutId?.totalAmount ?? 0,
      });
    }

    res.status(200).json({ message: "Order updated successfully" });
  } catch (err) {
    console.error("Failed to update order:", err);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = {
  createOrder,
  getOrdersByUser,
  getAllOrders,
  updateOrderStatus,
  generateInvoice,
};
