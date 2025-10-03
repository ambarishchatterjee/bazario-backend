const Category = require("../models/Category");
const Joi = require("joi");
const Product = require("../models/Product");

const categorySchema = Joi.object({
  name: Joi.string().required(),
  slug: Joi.string().required(),
});

// =============================
// Create Category (Admin)
// =============================
exports.createCategory = async (req, res) => {
  try {
    const { error } = categorySchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { name, slug } = req.body;
    const category = new Category({ name, slug });
    await category.save();

    res.status(201).json(category);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all categories
exports.getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// =============================
// Get products by category slug
// =============================
exports.getProductsByCategory = async (req, res) => {
  try {
    const { slug } = req.params;

    // find category by slug
    const category = await Category.findOne({ slug });
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    // find products belonging to this category
    const products = await Product.find({ category: category._id })
      .populate("vendor", "name email")   // optional populate
      .populate("category", "name slug"); // populate category info

    res.json({ category, products });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};