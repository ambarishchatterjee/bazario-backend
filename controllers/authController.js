const User = require("../models/User");
const Vendor = require("../models/Vendor");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const Joi = require("joi");

// =============================
// Validation Schemas
// =============================
const registerSchema = Joi.object({
  name: Joi.string().min(3).required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
  role: Joi.string().valid("buyer", "vendor").default("buyer"),
  shopName: Joi.string().when("role", {
    is: "vendor",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  businessCity: Joi.string().when("role", {
    is: "vendor",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  gst: Joi.string(),
  phone: Joi.string().when("role", {
    is: "buyer",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
  address: Joi.string().when("role", {
    is: "buyer",
    then: Joi.required(),
    otherwise: Joi.optional(),
  }),
});

const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// =============================
// Register
// =============================
exports.register = async (req, res) => {
  try {
    const { error } = registerSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, email, password, role, shopName, businessCity, gst, phone, address } = req.body;

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    user = new User({ name, email, password: hashedPassword, role, phone, address });
    await user.save();

    // If vendor, create vendor profile (approval pending)
    if (role === "vendor") {
      const vendor = new Vendor({
        user: user._id,
        shopName,
        businessCity,
        gst,
        approved: false,
      });
      await vendor.save();
    }

    res
      .status(201)
      .json({ message: "Registration successful. Awaiting approval if vendor." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Login
// =============================
exports.login = async (req, res) => {
  try {
    const { error } = loginSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    if (user.isBanned) return res.status(403).json({ message: "User is banned" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Get Current User (/api/auth/me)
// =============================
exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    // If vendor, also fetch vendor profile (shopName, businessCity, gst, approved)
    let vendorProfile = null;
    if (user.role === "vendor") {
      vendorProfile = await Vendor.findOne({ user: user._id }).select(
        "shopName businessCity gst approved"
      );
    }

    res.json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isBanned: user.isBanned,
      },
      vendorProfile,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
