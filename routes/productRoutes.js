/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */

/**
 * @swagger
 * /products:
 *   post:
 *     summary: Create a new product (Vendor only)
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *                 example: Smartwatch Pro
 *               description:
 *                 type: string
 *                 example: Advanced smartwatch with fitness tracking
 *               price:
 *                 type: number
 *                 example: 2999
 *               stock:
 *                 type: number
 *                 example: 10
 *               category:
 *                 type: string
 *                 example: 68a5c86ff53c3d9628be9278
 *     responses:
 *       201:
 *         description: Product created, awaiting approval
 *
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of products
 *
 * /products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 */

const express = require("express");
const { createProduct, getProducts, getProductById } = require("../controllers/productController");
const { protect } = require("../middlewares/authMiddleware");
const { isVendor } = require("../middlewares/roleMiddleware");
const upload = require("../middlewares/uploadMiddleware");

const router = express.Router();

// Vendor
router.post("/", protect, isVendor, upload.single('image'), createProduct);

// Public
router.get("/", getProducts);
router.get("/:id", getProductById);

module.exports = router;
