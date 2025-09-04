const Order = require("../models/Order");
const Product = require("../models/Product");
const Vendor = require("../models/Vendor");

//vendor page
exports.getVendors = async (req, res) => {
  try {
    const vendors = await Vendor.find().populate("user", "name email");

    res.json(vendors);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading vendors");
  }
};

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category, image } = req.body;

    // Find vendor linked to the logged-in user
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(403).json({ message: "Vendor not found" });

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      image,
      vendor: vendor._id,
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getVendorProducts = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) return res.status(403).json({ message: "Vendor not found" });

    const products = await Product.find({ vendor: vendor._id }).sort({
      createdAt: -1,
    });
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findOne({ user: req.user._id });
    const product = await Product.findOne({ _id: id, vendor: vendor._id });

    if (!product) return res.status(404).json({ message: "Product not found" });
    if (req.file) {
      product.image = req.file ? `/uploads/${req.file.filename}` : "";
    }
    Object.assign(product, req.body);
    await product.save();

    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const vendor = await Vendor.findOne({ user: req.user._id });
    const product = await Product.findOneAndDelete({
      _id: id,
      vendor: vendor._id,
    });

    if (!product) return res.status(404).json({ message: "Product not found" });

    res.json({ message: "Product deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/vendorController.js
exports.getVendorMe = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id }).populate(
      "user",
      "name email"
    );
    if (!vendor) return res.status(404).json({ message: "Vendor not found" });

    // Total Products
    const totalProducts = await Product.countDocuments({ vendor: vendor._id });

    // Total Orders
    const totalOrders = await Order.countDocuments({
      "items.vendor": vendor._id,
    });

    // Revenue
    const revenueAgg = await Order.aggregate([
      { $match: { "items.vendor": vendor._id } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } },
    ]);

    const revenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

    res.json({
      vendor,
      totalProducts,
      totalOrders,
      revenue,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// controllers/vendorController.js
// Get all orders for logged-in vendor
exports.getVendorOrders = async (req, res) => {
  try {
    const vendor = await Vendor.findOne({ user: req.user._id });
    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

    // Find all orders that have items for this vendor
    const orders = await Order.find({ "items.vendor": vendor._id })
      .populate("buyer", "name email")
      .populate("items.product", "name price");

    res.json(orders);
  } catch (err) {
    console.error("Error fetching vendor orders:", err);
    res.status(500).json({ message: err.message });
  }
};

exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const order = await Order.findById(id);

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Optional: check if this order belongs to the vendor
    if (
      !order.items.some((i) => i.vendor.toString() === req.user._id.toString())
    ) {
      return res.status(403).json({ message: "You cannot update this order" });
    }

    order.status = status;
    await order.save();

    res.json(order);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
