const Category = require("../models/Category");
const Joi = require("joi");

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
