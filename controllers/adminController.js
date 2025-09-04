const Vendor = require("../models/Vendor");
const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");

// Approve vendor
exports.approveVendor = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.approved = true;
  await vendor.save();
  res.json({ message: "Vendor approved" });
};

// Reject vendor
exports.rejectVendor = async (req, res) => {
  const vendor = await Vendor.findById(req.params.id);
  if (!vendor) return res.status(404).json({ message: "Vendor not found" });

  vendor.approved = false;
  await vendor.save();
  res.json({ message: "Vendor rejected" });
};

// Approve product
exports.approveProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.status = "approved";
  await product.save();
  res.json({ message: "Product approved" });
};

// Reject product
exports.rejectProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: "Product not found" });

  product.status = "rejected";
  await product.save();
  res.json({ message: "Product rejected" });
};

// Ban user
exports.banUser = async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "User not found" });

  user.isBanned = true;
  await user.save();
  res.json({ message: "User banned" });
};

// Sales Report
exports.salesReport = async (req, res) => {
  const sales = await Order.aggregate([
    { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
  ]);
  res.json({ totalSales: sales[0]?.totalSales || 0 });
};
