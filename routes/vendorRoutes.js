const express = require("express");
const {
  getVendors,
  getVendorProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  getVendorMe,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/vendorController");
const { protect } = require("../middlewares/authMiddleware");
const { isVendor } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

router.get("/", getVendors);

router.get("/products", protect, isVendor, getVendorProducts);
router.post("/products", protect, isVendor, createProduct);
router.put("/product/:id", protect, isVendor, upload.single('image'), updateProduct);
router.delete("/product/:id", protect, isVendor, deleteProduct);
router.get("/me", protect, isVendor, getVendorMe);

// routes/vendorRoutes.js
router.get("/orders", protect, isVendor, getVendorOrders);
router.put("/orders/:id/status", protect, isVendor, updateOrderStatus);



module.exports = router;
