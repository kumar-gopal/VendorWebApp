import express from "express";
import { verifyToken } from "../middleware/auth.js"; // Authentication middleware
import {
  createReview,
  getReviewsByProduct,
  getReviewById,
  updateReview,
  deleteReview
} from "../controllers/reviewController.js";

const router = express.Router();

router.post("/", verifyToken, createReview); // Create review
router.get("/:productId", getReviewsByProduct); // Get reviews for a product
router.get("/single/:id", getReviewById); // Get single review
router.put("/:id", verifyToken, updateReview); // Update review
router.delete("/:id", verifyToken, deleteReview); // Delete review

export default router;
