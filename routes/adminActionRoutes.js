
const express = require("express");
const {
  approveVendor,
  rejectVendor,
  approveProduct,
  rejectProduct,
  banUser,
  salesReport
} = require("../controllers/adminActionController");

const { adminProtect } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

// Protect all routes
router.use(adminProtect);

// Vendor Approvals
router.get("/vendors/:id/approve", approveVendor);
router.get("/vendors/:id/reject", rejectVendor);

// Product Approvals
router.get("/products/:id/approve", approveProduct);
router.get("/products/:id/reject", rejectProduct);

// Ban User
router.get("/users/:id/ban", banUser);

// Sales Report
router.get("/reports/sales", salesReport);

module.exports = router;
