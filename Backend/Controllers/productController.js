const productModel = require("../Models/productModel");

const store = async (req, res) => {
  try {
    const product = new productModel({
      name: req.body.name,
      categories: req.body.categories,
      oldprice: req.body.oldprice,
      newprice: req.body.newprice,
      stock: req.body.stock,
      image: req.file?.filename,
      description: req.body.description,
    });

    await product.save();
    res.status(200).send({ message: "Product Added successfully" });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "error" });
  }
};

const fetchall = async (req, res) => {
  try {
    const { categories, minPrice, maxPrice, sort } = req.query;

    let filter = {};

    // Category filtering (case-insensitive)
    if (categories) {
      const categoryArray = categories.split(",").map((c) => c.trim());
      filter.categories = {
        $in: categoryArray.map((cat) => new RegExp(`^${cat}$`, "i")),
      };
    }

    // Price filtering
    if (minPrice || maxPrice) {
      filter.newprice = {};
      if (minPrice) filter.newprice.$gte = parseFloat(minPrice);
      if (maxPrice) filter.newprice.$lte = parseFloat(maxPrice);
    }

    let sortOption = {};
    if (sort === "high") {
      sortOption = { newprice: -1 }; // High to Low
    } else if (sort === "low") {
      sortOption = { newprice: 1 }; // Low to High
    } else {
      sortOption = { _id: -1 }; // Default: newest first
    }

    const products = await productModel.find(filter).sort(sortOption);
    res.status(200).json({ data: products });
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "error" });
  }
};

const fetchOne = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findById(id);
    res.status(200).json({ data: product });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "error" });
  }
};

const Delete = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await productModel.findByIdAndDelete(id);
    res.status(200).json({ data: product });
  } catch (e) {
    console.log(e);
    res.status(500).send({ message: "error" });
  }
};

const update = async (req, res) => {
  try {
    const id = req.params.id;
    const data = {
      name: req.body.name,
      categories: req.body.categories,
      oldprice: req.body.oldprice,
      newprice: req.body.newprice,
      stock: req.body.stock,
      image: req.body.image,
      description: req.body.description,
    };

    if (req.file) {
      data.image = req.file.filename;
    }

    const result = await productModel.findByIdAndUpdate(id, data, {
      new: true,
    });
    res.status(200).json({ result: result });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

const fetchInstagramProducts = async (req, res) => {
  try {
    const products = await productModel
      .find({}, { image: 1 })
      .sort({ _id: -1 })
      .limit(5);

    res.status(200).json({ data: products });
  } catch (e) {
    console.log(e);
    res.status(500).json({ message: "error" });
  }
};

const recommendation = async (req, res) => {
  try {
    const { categories, excludeIds } = req.body;

    if (!categories || !Array.isArray(categories) || categories.length === 0) {
      return res
        .status(400)
        .json({ success: false, message: "Categories are required" });
    }

    const filter = {
      categories: {
        $in: categories.map((cat) => new RegExp(`^${cat}$`, "i")), // Case-insensitive
      },
    };

    if (excludeIds && excludeIds.length > 0) {
      filter._id = { $nin: excludeIds }; // Exclude already-in-cart items
    }

    const products = await productModel.find(filter).limit(10);

    res.status(200).json({ success: true, products });
  } catch (e) {
    console.error("Recommendation error:", e);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const addReview = async (req, res) => {
  try {
    const { productId, userId, username, comment, rating } = req.body;

    const product = await productModel.findById(productId);
    if (!product) return res.status(404).json({ message: "Product not found" });

    const newReview = { userId, username, comment, rating };
    product.reviews.push(newReview);
    await product.save();

    res
      .status(200)
      .json({ message: "Review added successfully", data: product.reviews });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error adding review" });
  }
};


module.exports = {
  store,
  fetchall,
  fetchOne,
  Delete,
  update,
  addReview,
  fetchInstagramProducts,
  recommendation,
};
