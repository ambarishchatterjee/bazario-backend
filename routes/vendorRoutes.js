/**
 * @swagger
 * tags:
 *   name: Vendors
 *   description: Vendor operations (Products, Orders, Profile)
 */

/**
 * @swagger
 * /vendors:
 *   get:
 *     summary: Get all vendors
 *     tags: [Vendors]
 *     responses:
 *       200:
 *         description: List of vendors
 */

/**
 * @swagger
 * /vendors/products:
 *   get:
 *     summary: Get all products for the logged-in vendor
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor's products
 *
 *   post:
 *     summary: Create a new product
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 */

/**
 * @swagger
 * /vendors/product/{id}:
 *   put:
 *     summary: Update a vendor product
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: number
 *               category:
 *                 type: string
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *
 *   delete:
 *     summary: Delete a vendor product
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product deleted successfully
 */

/**
 * @swagger
 * /vendors/me:
 *   get:
 *     summary: Get logged-in vendor profile
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Vendor profile
 */

/**
 * @swagger
 * /vendors/orders:
 *   get:
 *     summary: Get vendor's orders
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor orders
 *
 * /vendors/orders/{id}/status:
 *   put:
 *     summary: Update order status
 *     tags: [Vendors]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Order ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - status
 *             properties:
 *               status:
 *                 type: string
 *                 enum: [placed, shipped, delivered, cancelled]
 *     responses:
 *       200:
 *         description: Order status updated successfully
 */


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
