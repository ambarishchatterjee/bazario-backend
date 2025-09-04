const Product = require("../models/Product");
const Joi = require("joi");
const Vendor = require("../models/Vendor");

const productSchema = Joi.object({
  name: Joi.string().required(),
  description: Joi.string().allow(""),
  price: Joi.number().required(),
  stock: Joi.number().default(0),
  image: Joi.string().allow(""),
  category: Joi.string().required(),
});

// =============================
// Create Product (Vendor)
// =============================
// exports.createProduct = async (req, res) => {
//   try {
//     const { error } = productSchema.validate(req.body);
//     if (error)
//       return res.status(400).json({ message: error.details[0].message });
//     // Find vendor profile for this user
//     const vendor = await Vendor.findOne({ user: req.user.id, approved: true });
//     if (!vendor) {
//       return res
//         .status(403)
//         .json({ message: "You must be an approved vendor to add products." });
//     }
//     const product = new Product({
//       ...req.body,
//       vendor: vendor._id,
//       status: "pending", // needs admin approval
//     });

//     await product.save();
//     res
//       .status(201)
//       .json({ message: "Product created, awaiting approval.", product });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

exports.createProduct = async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    // Find vendor profile for this user
    const vendor = await Vendor.findOne({ user: req.user.id, approved: true });
    if (!vendor) {
      return res.status(403).json({ message: "You must be an approved vendor to add products." });
    }

    const product = new Product({
      name,
      description,
      price,
      stock,
      category,
      vendor: vendor._id,
      status: "pending",
      image: req.file ? `/uploads/${req.file.filename}` : "", // save file path
    });

    await product.save();
    res.status(201).json({ message: "Product created, awaiting approval.", product });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

// Get all approved products
exports.getProducts = async (req, res) => {
  try {
    const { minPrice, maxPrice, category, vendor } = req.query;

    let filter = { status: "approved" }; // only show approved products to buyers

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (category) filter.category = category;
    if (vendor) filter.vendor = vendor;

    const products = await Product.find(filter)
      .populate("category", "name")
      .populate("vendor", "shopName name");

    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get single product
exports.getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category")
      .populate("vendor");
    if (!product) return res.status(404).json({ message: "Product not found" });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
