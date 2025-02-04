import express from "express";

const router = express.Router();
import {registerUser,loginUser,logoutUser,refreshToken, getUserById, getUsers} from "../controllers/userController.js"

router.post("/register",registerUser);
router.post("/login",loginUser);
router.post("/logout",logoutUser);
router.post("/refresh-token",refreshToken);
router.get("/:id",getUserById);
router.get("/",getUsers);

export default router;