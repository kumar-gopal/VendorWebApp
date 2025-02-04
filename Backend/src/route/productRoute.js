import express from "express";
import upload  from "../middleware/multerMiddleware.js"; 
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productController.js";

const router = express.Router();
import { adminOnly,protect } from "../middleware/authMiddleware.js";
router.use(protect);
// this is accessible by everyone
router.get("/", getProducts);
router.get("/:id", getProductById);

// only admin can access
router.use(adminOnly);
router.post("/create", upload.array("images", 5), createProduct); 
router.put("/update/:id", upload.array("images", 5), updateProduct);
router.delete("/:id", deleteProduct);

export default router;
