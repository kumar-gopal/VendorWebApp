import express from "express";
const router = express.Router();
import {
    createAddress,
    getAllAddresses,
    getAddressById,
    updateAddress,
    deleteAddress
} from "../controllers/addressController.js"; 
import {protect} from "../middleware/authMiddleware.js";

// here check is user logged in
router.use(protect);

router.get("/", getAllAddresses);
router.post("/", createAddress);
router.get("/:id", getAddressById);
router.put("/:id", updateAddress);
router.delete("/:id", deleteAddress);

export default router;
