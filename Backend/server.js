const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
require("./db");

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static folder for uploaded images
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// In server.js or app.js

app.use("/invoices", express.static(path.join(__dirname, "invoices")));

// Routers (with correct base paths)
const userRouter = require("./Routers/userRouter");
app.use("/api/user", userRouter);

const productRouter = require("./Routers/productRouter");
app.use("/api/product", productRouter);

const cartRouter = require("./Routers/cartRouter");
app.use("/api/cart", cartRouter); // ✅ cart APIs like /api/cart/add, etc.

const checkoutRouter = require("./Routers/checkoutRouter");
app.use("/api/checkout", checkoutRouter); // ✅ checkout APIs like /api/checkout/:cartId

const wishlistRouter = require("./Routers/wishlistRouter");
app.use("/api/wishlist", wishlistRouter);

const orderRouter = require("./Routers/orderRouter");
app.use("/api/order", orderRouter);

const bannerRouter = require("./Routers/bannerRouter");
app.use("/api/banner", bannerRouter);

const newproductRouter = require("./Routers/newproductRouter");
app.use("/api/newproduct",newproductRouter);

const contentRoutes = require("./Routers/contentRoutes");
app.use("/api/content", contentRoutes);
// Start server

const chooseUsRoutes = require("./Routers/chooseUsRoutes");
app.use("/api/chooseUs", chooseUsRoutes);

const expertiseRoutes = require("./Routers/expertiseRoutes");
app.use("/api/expertise", expertiseRoutes);
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
