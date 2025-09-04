// controllers/adminViewController.js
const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Vendor = require("../models/Vendor");

//users page
exports.getUsersPage = async (req, res) => {
  try {
    const users = await User.find();
    res.render("admin/users", {
      title: "Users",
      users,
      layout: "layouts/adminLayout", // required for express-ejs-layouts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading users");
  }
};

//vendor page
exports.getVendorsPage = async (req, res) => {
  try {
    const vendors = await Vendor.find()
                        .populate('user', 'name email');
                        
    res.render("admin/vendors", {
      title: "Vendors",
      vendors,
      layout: "layouts/adminLayout", // required for express-ejs-layouts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading vendors");
  }
};

// Products Page
exports.getProductsPage = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("category", "name")
      .populate("vendor", "name email shopName");
      
    res.render("admin/products", {
      title: "Products",
      products,
      layout: "layouts/adminLayout",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading products");
  }
};

// Orders Page
exports.getOrdersPage = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("buyer", "name email") // ✅ matches schema
      .populate("items.product", "name price")
      .populate("items.vendor", "shopName name email");

      console.log(orders);
      
    
      
    res.render("admin/orders", {
      title: "Orders",
      orders,
      layout: "layouts/adminLayout",
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading orders");
  }
};

// Reports Page
exports.getReportsPage = async (req, res) => {
  try {
    // Total sales
    const totalSales = await Order.aggregate([
//      { $match: { status: "delivered" } },
      { $group: { _id: null, total: { $sum: "$totalAmount" } } }
    ]);

    // Monthly sales
    const monthlySales = await Order.aggregate([
//      { $match: { status: "delivered" } },
      { $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        total: { $sum: "$totalAmount" }
      }},
      { $sort: { "_id.year": 1, "_id.month": 1 } }
    ]);

    // Top vendors
    const topVendors = await Order.aggregate([
      { $unwind: "$items" },
//      { $match: { status: "delivered" } },
      { $group: { _id: "$items.vendor", totalSales: { $sum: {$multiply : ["$items.price", "$items.quantity"]} } } },
      { $sort: { totalSales: -1 } },
      { $limit: 5 },
      {
        $lookup: {
            from: "vendors",
            localField: "_id",
            foreignField: "_id",
            as: "vendor"
        }
      },
      {
        $unwind: "$vendor"
      },
      {
        $project: {
            _id: 1,
            totalSales: 1,
            shopName: "$vendor.shopName"
        }
      }
    ]);

    console.log(topVendors);

    //top products
    // Top Products (by revenue)
const topProducts = await Order.aggregate([
  { $unwind: "$items" },
  {
    $group: {
      _id: "$items.product",
      totalSales: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
    }
  },
  { $sort: { totalSales: -1 } },
  { $limit: 5 },
  {
    $lookup: {
      from: "products",
      localField: "_id",
      foreignField: "_id",
      as: "product"
    }
  },
  { $unwind: "$product" },
  {
    $project: {
      productName: "$product.name",
      totalSales: 1
    }
  }
]);
    

    res.render("admin/reports", {
      title: "Reports",
      layout: "layouts/adminLayout",
      totalSales: totalSales[0]?.total || 0,
      monthlySales,
      topVendors,
      topProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading reports");
  }
};

//dashboard page
exports.getDashboardPage = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalVendors = await Vendor.countDocuments({ approved: true });
    const pendingVendors = await Vendor.countDocuments({ approved: false });
    const totalProducts = await Product.countDocuments({ status: "approved" });
    const pendingProducts = await Product.countDocuments({ status: "pending" });
    const totalOrders = await Order.countDocuments();
    const recentOrders = await Order.find().sort({ createdAt: -1 }).limit(5).populate("buyer", "name");
    const recentProducts = await Product.find({ status: "pending" }).sort({ createdAt: -1 }).limit(5);

    res.render("admin/dashboard", {
      title: "Dashboard",
      layout: "layouts/adminLayout",
      stats: { totalUsers, totalVendors, pendingVendors, totalProducts, pendingProducts, totalOrders },
      recentOrders,
      recentProducts
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Error loading dashboard");
  }
};