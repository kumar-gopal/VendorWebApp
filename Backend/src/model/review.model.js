import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product", 
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", 
      required: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1, 
      max: 5, 
      default : 1
    },
    comment: {
      type: String,
      required: true,
      trim: true,
      minlength: 10, 
      maxlength: 500,
    },
    helpfulVotes: {
      type: Number,
      default: 0, 
    },
  },
  {
    timestamps: true, 
  }
);

// Prevent a user from reviewing the same product multiple times
reviewSchema.index({ product: 1, user: 1 }, { unique: true });

export const Review = mongoose.model("Review", reviewSchema);
