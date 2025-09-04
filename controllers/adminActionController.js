const Product = require("../models/Product");
const User = require("../models/User");
const Order = require("../models/Order");
const Vendor = require("../models/Vendor");

// Approve vendor
exports.approveVendor = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.params.id);
    if (!vendor ) {
      req.flash("error", "Vendor not found");
      return res.redirect("/admin/vendors");
    }

    vendor.approved = true;
    await vendor.save();
    req.flash("success", "Vendor approved successfully");
    res.redirect("/admin/vendors");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/vendors");
  }
};

// Reject vendor
exports.rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findById(req.params.id);
    if (!vendor || vendor.role !== "vendor") {
      req.flash("error", "Vendor not found");
      return res.redirect("/admin/vendors");
    }

    vendor.isApproved = false;
    await vendor.save();
    req.flash("success", "Vendor rejected successfully");
    res.redirect("/admin/vendors");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/vendors");
  }
};

// Approve product
exports.approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/admin/products");
    }

    product.status = "approved";
    await product.save();
    req.flash("success", "Product approved successfully");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/products");
  }
};

// Reject product
exports.rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      req.flash("error", "Product not found");
      return res.redirect("/admin/products");
    }

    product.status = "rejected";
    await product.save();
    req.flash("success", "Product rejected successfully");
    res.redirect("/admin/products");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/products");
  }
};

// Ban user
exports.banUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      req.flash("error", "User not found");
      return res.redirect("/admin/users");
    }

    user.isBanned = true;
    await user.save();
    req.flash("success", "User banned successfully");
    res.redirect("/admin/users");
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/users");
  }
};

// Sales Report
exports.salesReport = async (req, res) => {
  try {
    const sales = await Order.aggregate([
      { $group: { _id: null, totalSales: { $sum: "$totalAmount" } } },
    ]);

    const totalSales = sales[0]?.totalSales || 0;

    res.render("admin/reports", {
      title: "Sales Report",
      totalSales,
      layout: "layouts/adminLayout",
    });
  } catch (err) {
    console.error(err);
    req.flash("error", "Something went wrong");
    res.redirect("/admin/dashboard");
  }
};
