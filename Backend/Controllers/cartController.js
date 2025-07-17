const Cart = require("../Models/cartModel");

// Fetch Cart by userId
const getCartByUserId = async (req, res) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required" });
    }

    const cart = await Cart.findOne({ userId })
      .populate("products.productId")
      .exec();

    if (!cart) {
      return res.status(200).json({ success: true, cart: { products: [] } }); // empty cart response
    }

    res.status(200).json({ success: true, cart });
  } catch (error) {
    console.error("Error fetching cart:", error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// Add to Cart
const addToCart = async (req, res) => {
  try {
    const { userId, productId, quantity } = req.body;

    let cart = await Cart.findOne({ userId });

    if (cart) {
      const index = cart.products.findIndex(
        (p) => p.productId.toString() === productId
      );
      if (index > -1) {
        cart.products[index].quantity += quantity || 1;
      } else {
        cart.products.push({ productId, quantity });
      }
      await cart.save();
    } else {
      cart = new Cart({
        userId,
        products: [{ productId, quantity }],
      });
      await cart.save();
    }

    res
      .status(200)
      .json({ success: true, message: "Product added to cart", cart });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

const updateCartQuantity = async (req, res) => {
  try {
    const { userId, productId, action } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    const productIndex = cart.products.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (productIndex === -1) {
      return res.status(404).json({ success: false, message: "Product not in cart" });
    }

    if (action === "inc") {
      cart.products[productIndex].quantity += 1;
    } else if (action === "dec") {
      cart.products[productIndex].quantity -= 1;
      if (cart.products[productIndex].quantity < 1) {
        // Remove if quantity is less than 1
        cart.products.splice(productIndex, 1);
      }
    }

    await cart.save();

    return res.status(200).json({ success: true, message: "Cart updated", cart });
  } catch (error) {
    console.error("Error updating cart:", error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

const deleteFromCart = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    const cart = await Cart.findOne({ userId });
    if (!cart) {
      return res.status(404).json({ success: false, message: "Cart not found" });
    }

    // Remove product
    cart.products = cart.products.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ success: true, message: "Product removed from cart", cart });
  } catch (err) {
    console.error("Error removing product:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

module.exports = { getCartByUserId, addToCart ,updateCartQuantity,deleteFromCart};
