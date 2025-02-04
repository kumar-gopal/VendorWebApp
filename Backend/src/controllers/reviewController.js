import { Review } from "../models/review.js";
import { Product } from "../models/product.js";
import mongoose from "mongoose";

// Create a new review
export const createReview = async (req, res) => {
  try {
    const { product, rating, comment } = req.body;
    const user = req.user._id; // Get logged-in user from request

    // Check if product exists
    const existingProduct = await Product.findById(product);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Check if user already reviewed this product
    const existingReview = await Review.findOne({ product, user });
    if (existingReview) {
      return res.status(400).json({ message: "You have already reviewed this product" });
    }

    // Create new review
    const review = new Review({ product, user, rating, comment });
    await review.save();

    // Update product ratings
    const updatedProduct = await updateProductRatings(product);

    res.status(201).json({ message: "Review added successfully", review, updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get all reviews for a product
export const getReviewsByProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    // Check if product exists
    const existingProduct = await Product.findById(productId);
    if (!existingProduct) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Fetch reviews
    const reviews = await Review.find({ product: productId }).populate("user", "name email");
    res.json(reviews);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get a single review
export const getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id).populate("user", "name email");
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }
    res.json(review);
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update a review
export const updateReview = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const review = await Review.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id }, // Ensure user can update only their review
      { rating, comment },
      { new: true, runValidators: true }
    );

    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    // Update product ratings
    const updatedProduct = await updateProductRatings(review.product);

    res.json({ message: "Review updated successfully", review, updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Delete a review
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!review) {
      return res.status(404).json({ message: "Review not found or unauthorized" });
    }

    // Update product ratings
    const updatedProduct = await updateProductRatings(review.product);

    res.json({ message: "Review deleted successfully", updatedProduct });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update product ratings dynamically
const updateProductRatings = async (productId) => {
  const reviews = await Review.find({ product: productId });

  const count = reviews.length;
  const average = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

  return Product.findByIdAndUpdate(productId, { "ratings.average": average, "ratings.count": count }, { new: true });
};
