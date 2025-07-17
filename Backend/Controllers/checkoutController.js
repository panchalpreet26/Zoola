const Cart = require("../Models/cartModel");
const Product = require("../Models/productModel");
const Checkout = require("../Models/checkoutModel");

const fs = require("fs");
const path = require("path");
const PDFDocument = require("pdfkit");

const generateInvoice = (orderData, orderId) => {
  const doc = new PDFDocument();
  const invoicePath = path.join(
    __dirname,
    `../invoices/invoice-${orderId}.pdf`
  );
  // doc.font("fonts/Roboto-Regular.ttf");
  doc.pipe(fs.createWriteStream(invoicePath));

  doc.fontSize(18).text("ZULAS Invoice", { align: "center" });
  doc.moveDown();

  doc.fontSize(12).text(`Order ID: ${orderId}`);
  doc.moveDown(2);
  doc.text(
    `Name: ${orderData.customerDetails.firstName} ${orderData.customerDetails.lastName}`
  );
  doc.text(`Email: ${orderData.customerDetails.email}`);
  doc.text(`Phone: ${orderData.customerDetails.phone}`);
  doc.text(`Address: ${orderData.customerDetails.address}`);
  doc.moveDown();

  doc.text("Products:");
  orderData.products.forEach((item, index) => {
    doc.text(
      `${index + 1}. ${item.name} (Qty: ${item.quantity}) - ₹${item.itemTotal}`
    );
  });

  doc.moveDown();
  doc.text(`Subtotal: ₹${orderData.subtotal}`);
  
  doc.text(`Shipping: ₹${orderData.shipping}`);
  doc.text(`Tax: ₹${orderData.tax}`);
  doc.text(`Total: ₹${orderData.totalAmount}`);
  doc.end();
};

const createCheckout = async (req, res) => {
  console.log("Incoming checkout body:", req.body);

  try {
    const { cartId, shipping, subtotal, tax, totalAmount } = req.body;

    // console.log(totalAmount,"jhk");/*
    if (!cartId || subtotal == null || tax == null || totalAmount == null) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const newCheckout = new Checkout({
      cartId,
      shipping,
      subtotal,
      tax,
      totalAmount,
    });

    await newCheckout.save();

    res
      .status(201)
      .json({ success: true, message: "Checkout saved", data: newCheckout });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

const getCheckoutDetailsByCartId = async (req, res) => {
  try {
    const { cartId } = req.params;

    const checkout = await Checkout.findOne({ cartId });
    if (!checkout)
      return res
        .status(404)
        .json({ success: false, message: "Checkout not found" });

    const cart = await Cart.findById(cartId).populate("products.productId");
    if (!cart)
      return res
        .status(404)
        .json({ success: false, message: "Cart not found" });

    const products = cart.products.map((item) => ({
      name: item.productId.name,
      image: item.productId.image,
      quantity: item.quantity,
      itemTotal: item.quantity * item.productId.newprice,
    }));

    return res.status(200).json({
      success: true,
      products,
      subtotal: checkout.subtotal,
      shipping: checkout.shipping,
      tax: checkout.tax,
      total: checkout.totalAmount,
    });
  } catch (error) {
    console.error("Checkout fetch error:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

const storePaymentDetails = async (req, res) => {
  try {
    const {
      cartId,
      firstName,
      lastName,
      email,
      phone,
      address,
      products,
      subtotal,
      shipping,
      tax,
      total,
      paymentId,
      paymentStatus,
    } = req.body;

    if (!cartId || !paymentId || !paymentStatus) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    const newCheckout = new Checkout({
      cartId,
      shipping,
      subtotal,
      tax,
      totalAmount: total,
      paymentId,
      paymentStatus,
      customerDetails: {
        firstName,
        lastName,
        email,
        phone,
        address,
      },
      products,
    });

    await newCheckout.save();
    generateInvoice(newCheckout, newCheckout._id);
    return res.status(201).json({
      success: true,
      message: "Payment and order stored",
      data: newCheckout,
    });
  } catch (err) {
    console.error("Error storing payment info:", err);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

module.exports = {
  getCheckoutDetailsByCartId,
  createCheckout,
  storePaymentDetails,
  generateInvoice,
};
