import express from "express";
import {
    createOrder,
    getAllOrders,
    getOrderById,
    updateOrder,
    updateOrderStatus,
    deleteOrder,
} from "../controllers/orderController.js";

const router = express.Router();

import verifyVendor from "../middleware/vendorValidate.js";
import {isAdmin} from "../middleware/adminMiddleware.js";
// middleware for authenticate user
router.use(verifyVendor);

router.post("/", createOrder);
router.get("/", getAllOrders);
router.get("/:id", getOrderById);
router.put("/:id",updateOrder);
// this one is accessible by Admin
router.patch("/:id/status",isAdmin , updateOrderStatus);

router.delete("/:id", deleteOrder);

export default router;
