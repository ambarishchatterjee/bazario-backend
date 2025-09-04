/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: User authentication
 */

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user (buyer or vendor)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *                 example: John Doe
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *               role:
 *                 type: string
 *                 enum: [buyer, vendor]
 *                 example: vendor
 *     responses:
 *       201:
 *         description: User registered successfully
 *
 * /auth/login:
 *   post:
 *     summary: User login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: johndoe@example.com
 *               password:
 *                 type: string
 *                 example: 123456
 *     responses:
 *       200:
 *         description: Login successful, returns JWT token
 */


const express = require('express')
const {
  register,
  verifyEmail,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.js");
const { protect } = require('../middlewares/authMiddleware.js');
const { getMe } = require('../controllers/authController.js');

const router = express.Router();

router.post("/register", register);
//router.get("/verify/:token", verifyEmail);
router.post("/login", login);

router.get("/me", protect, getMe);
//router.post("/forgot-password", forgotPassword);
//router.post("/reset-password/:token", resetPassword);

module.exports = router
