const Wishlist = require("../Models/wishlistModel");

// Add to wishlist
exports.addToWishlist = async (req, res) => {
    
  try {
    const { userId, productId } = req.body;

    // Check if already in wishlist
    const exists = await Wishlist.findOne({ userId, productId });
    if (exists) {
      return res.status(400).json({ message: "Already in wishlist" });
    }

    const wishlistItem = new Wishlist({ userId, productId });
    await wishlistItem.save();

    res.status(201).json({ message: "Added to wishlist", data: wishlistItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all wishlist items for a user
exports.getWishlistByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const items = await Wishlist.find({ userId }).populate("productId");
    res.status(200).json({ data: items });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Remove from wishlist
exports.removeFromWishlist = async (req, res) => {
  try {
    const { id } = req.params; // wishlist item ID
    await Wishlist.findByIdAndDelete(id);
    res.status(200).json({ message: "Item removed from wishlist" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
