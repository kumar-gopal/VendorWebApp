import express from "express";
const router = express.Router();
import { vendorSignup,vendorSignInstep, vendorSignIn,getvendors } from "../controllers/vendorControllers.js";
import varifyVendor from "../middleware/vendorValidate.js";

// 1.sign up through cmpnyname ,email,phone ....
// 2.for sign in two step 1.enter email then send vendorId and password to email then login the vendor

router.post("/signup",vendorSignup);
router.post("/signin",vendorSignInstep);
router.patch("/signin",vendorSignIn);
router.get("/",varifyVendor,getvendors);


export default router;



