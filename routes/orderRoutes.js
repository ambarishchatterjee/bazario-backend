/**
 * @swagger
 * tags:
 *   name: Orders
 *   description: Order management for buyers and vendors
 */

/**
 * @swagger
 * /orders:
 *   post:
 *     summary: Place a new order
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - items
 *             properties:
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     product:
 *                       type: string
 *                       description: Product ID
 *                     quantity:
 *                       type: number
 *                 example:
 *                   - product: 68a5c86ff53c3d9628be9278
 *                     quantity: 2
 *     responses:
 *       201:
 *         description: Order placed successfully
 */

/**
 * @swagger
 * /orders/my:
 *   get:
 *     summary: Get my orders (Buyer only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of buyer's orders
 */

/**
 * @swagger
 * /orders/vendor:
 *   get:
 *     summary: Get vendor's received orders
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of vendor's orders
 */

/**
 * @swagger
 * /orders/{id}/status:
 *   put:
 *     summary: Update order status (Vendor only)
 *     tags: [Orders]
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
 *                 example: shipped
 *     responses:
 *       200:
 *         description: Order status updated
 */

const express = require("express");
const {
  placeOrder,
  getMyOrders,
  getVendorOrders,
  updateOrderStatus,
} = require("../controllers/orderController");

const { protect } = require("../middlewares/authMiddleware");
const { isBuyer, isVendor } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Buyer places order + views own orders
router.post("/", protect, isBuyer, placeOrder);
router.get("/my", protect, isBuyer, getMyOrders);

// Vendor sees their orders
router.get("/vendor", protect, isVendor, getVendorOrders);

// Vendor updates order status (shipped, delivered, etc.)
router.put("/:id/status", protect, isVendor, updateOrderStatus);

module.exports = router;
