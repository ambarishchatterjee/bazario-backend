/**
 * @swagger
 * tags:
 *   name: Reviews
 *   description: Product reviews by buyers
 */

/**
 * @swagger
 * /reviews/{productId}:
 *   post:
 *     summary: Add a review for a product (Buyer only)
 *     tags: [Reviews]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - rating
 *               - comment
 *             properties:
 *               rating:
 *                 type: number
 *                 example: 4
 *               comment:
 *                 type: string
 *                 example: Great product!
 *     responses:
 *       201:
 *         description: Review added successfully
 *
 *   get:
 *     summary: Get all reviews for a product
 *     tags: [Reviews]
 *     parameters:
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: List of reviews
 */


const express = require("express");
const { addReview, getReviews } = require("../controllers/reviewController");

const { protect } = require("../middlewares/authMiddleware");
const { isBuyer } = require("../middlewares/roleMiddleware");

const router = express.Router();

// Buyer leaves review
router.post("/:productId", protect, isBuyer, addReview);

// Public view reviews
router.get("/:productId", getReviews);

module.exports = router;
