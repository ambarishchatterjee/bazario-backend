
const express = require("express");

const { protect } = require("../middlewares/authMiddleware");
const { isAdmin } = require("../middlewares/roleMiddleware");
const { getUsersPage, getVendorsPage, getProductsPage, getOrdersPage, getReportsPage, getDashboardPage } = require("../controllers/adminViewController");
const { getAdminLogin, postAdminLogin, postLogout } = require("../controllers/adminAuthController");
const { adminProtect } = require("../middlewares/adminAuthMiddleware");

const router = express.Router();

router.get("/login",  getAdminLogin);
router.post("/login", postAdminLogin);
router.get("/logout", postLogout);

router.use(adminProtect)
router.get("/users",  getUsersPage);
router.get("/vendors",  getVendorsPage);
router.get("/products",  getProductsPage);
router.get("/orders",  getOrdersPage);
router.get("/reports",  getReportsPage);
router.get("/dashboard", getDashboardPage);


module.exports = router