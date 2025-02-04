import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { RefreshToken } from "../model/refreshToken.js";

const generateTokens = async (user) => {
    if (!process.env.JWT_SECRET) {
        throw new Error("JWT_SECRET is not set in environment variables");
    }

    const accessToken = jwt.sign(
        {
            id: user._id,
            username: user.username,
            role : user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: JWT_EXPIRY }
    );

    const refreshToken = crypto.randomBytes(40).toString("hex");
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); 

    try {
        await RefreshToken.create({
            token: refreshToken,
            userId: user._id,
            expiresAt,
        });
    } catch (error) {
        throw new Error(`Failed to save refresh token: ${error.message}`);
    }

    return { accessToken, refreshToken };
};

const generateSalt = async () => {
    return await bcryptjs.genSalt(10); 
};

const generateHashPassword = async (password, salt) => {
    return await bcryptjs.hash(password, salt);
};

const comparePassword = async(plainPassword, hashpassword) => {
    return await bcryptjs.compare(plainPassword, hashpassword);
};

export {
    generateTokens,
    generateSalt,
    generateHashPassword,
    comparePassword,
};
