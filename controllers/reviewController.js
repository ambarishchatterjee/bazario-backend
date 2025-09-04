const Review = require("../models/Review");
const Joi = require("joi");

const reviewSchema = Joi.object({
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().allow(""),
});

// Add review
exports.addReview = async (req, res) => {
  try {
    const { error } = reviewSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const review = new Review({
      product: req.params.productId,
      user: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment,
    });

    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get product reviews
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ product: req.params.productId }).populate("user", "name");
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
