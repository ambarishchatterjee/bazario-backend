/**
 * @swagger
 * tags:
 *   name: Carts
 *   description: Shopping cart operations (Buyer only)
 */

/**
 * @swagger
 * /carts:
 *   post:
 *     summary: Add item to cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product
 *               - quantity
 *             properties:
 *               product:
 *                 type: string
 *                 description: Product ID
 *               quantity:
 *                 type: number
 *                 description: Quantity of product
 *     responses:
 *       201:
 *         description: Item added to cart
 *
 *   get:
 *     summary: Get current user's cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Returns cart details
 */

/**
 * @swagger
 * /carts/{itemId}:
 *   put:
 *     summary: Update quantity of an item in the cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of cart item
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: number
 *     responses:
 *       200:
 *         description: Cart item updated
 *
 *   delete:
 *     summary: Remove an item from cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: itemId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of cart item
 *     responses:
 *       200:
 *         description: Cart item removed
 */

/**
 * @swagger
 * /carts:
 *   delete:
 *     summary: Clear all items in the cart
 *     tags: [Carts]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

const express = require("express");
const {
  addToCart,
  getCart,
  updateCartItem,
  removeCartItem,
  clearCart,
} = require("../controllers/cartController");

const { protect } = require("../middlewares/authMiddleware");
const { isBuyer } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Buyer only
router.post("/", protect, isBuyer, addToCart);
router.get("/", protect, isBuyer, getCart);
router.put("/:itemId", protect, isBuyer, updateCartItem);
router.delete("/:itemId", protect, isBuyer, removeCartItem);
router.delete("/", protect, isBuyer, clearCart);

module.exports = router;
