import { logger } from "../utils/logger.js";
import { asyncErrorHandler } from "../middleware/errorHandler.js";
import { validateSignIn, validateSignUp } from "../utils/joiSchema.js"
import { User } from "../model/user.model.js";
import { comparePassword, generateHashPassword, generateSalt, generateTokens } from "../utils/password.utils.js";
import { RefreshToken } from "../model/refreshToken.js";
import { log } from "console";


const registerUser = asyncErrorHandler(async (req, res) => {
    logger.info("Register API endpoint hit");
    const { error, value } = validateSignUp(req.body);
    
    if (error) {
        logger.warn("Validation failed");
        return res.status(400).json({
            message : error.details[0]?.message || "Validation Failed",
            success : false,
        });
    }

    const { username, email, password } = value;

    const alreadyExistUser = await User.findOne({ $or: [{ username }, { email }] });

    if (alreadyExistUser) {
        logger.warn("User already exists");
       return res.status(400).json({
            message : "User already exists",
            success : false
       });
    }

    try {
        const salt = await generateSalt();
        const hashpassword = await generateHashPassword (password, salt);

        const user = new User({
            username,
            email,
            password: hashpassword,
        });

        await user.save();
    
        logger.info("User registered successfully")
        return res.status(201).json({
            message: "User registered successfully",
            success: true,
            user,
        });
    } catch (error) {
        logger.warn("Internal Server Error");
        res.status(500).json({
            message : error.message || "INTERNAL SERVER EEROR!!",
            success : false
        });
    }
    
});


const loginUser = asyncErrorHandler(async(req,res)=>{
    logger.info("Login API endpoint hit");
    const { error, value } = validateSignIn(req.body);
    
    if (error) {
        logger.warn("Validation failed");
        return res.status(400).json({
            message : error.details[0]?.message || "Validation Failed",
            success : false,
        });
    }

    const { email, password } = value;

    const user = await User.findOne({ email });
    logger.info(`User details - ${user}`);
    if (!user) {
        logger.warn("User doesn't exists you have to login first");
       return res.status(400).json({
            message : "User already exists",
            success : false
       });
    }
    try {
        const isValidPassword = await comparePassword(password,user.password);
        if(!isValidPassword){
            logger.warn("Invalid User Credentials");
            return res.status(400).json({
                message : "Invalid User Credentials",
                success : false
            });
        }
        const {accessToken,refreshToken} = await generateTokens(user);
        
        return res.status(201).json({
            message : "User logged in succesfully",
            success : true,
            accessToken : accessToken,
            refreshToken : refreshToken
        });
    } catch (error) {
        logger.warn("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }
});

const refreshToken = asyncErrorHandler(async(req,res)=>{
    try {
        const {token} = req.body;
        if(!token){
            logger.info("Token is required");
            res.status(400).json({
                message : "Token is required",
                success : false
            });
        }


        const storedToken = await RefreshToken.findOne({ token });
        
        if(!storedToken || storedToken.expiresAt < new Date()){
            logger.warn("You have entered invalid token or expired");
            return res.status(400).json({
                message : "You have entered invalid token or expired",
                success : false
            });
        }

        
        let  user = await User.findById(storedToken.userId);
        if(!user){
            logger.warn("User not found");
            res.status(404).json({
                message : "User not found",
                success : false
            });
        }
        
        
        const {accessToken,refreshToken} = await generateTokens(user)

        // delete old refresh token
        await RefreshToken.deleteOne({_id : storedToken._id});

        logger.info("New Refresh Token is Generated Successfully");
        res.status(201).json({
            message : "New Refresh Token is Generated Successfully",
            success : true,
            accessToken : accessToken,
            refreshToken : refreshToken
        });
    } catch (error) {
        logger.warn("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }
});


const logoutUser = asyncErrorHandler(async(req,res)=>{
    const {token} = req.body;
    if(!token){
        logger.info("Token is required");
        res.status(400).json({
            message : "Token is required",
            success : false
        });
    }
    try {
        const storedToken = await RefreshToken.findOne({ token });
        if(!storedToken){
            logger.warn("Invalide Token ");
            res.status(400).json({
                message : error.message || "Invalide Token",
                success : false
            })
        }

        await RefreshToken.deleteOne({token});
        return res.status(201).json({
            message : "User logged out succesfully",
            success : true,
        });
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error || "Internal Server Error",
            success : false
        });
        
    }
});

const getUsers = asyncErrorHandler(async(req,res)=>{
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 1;
        const skip = (page - 1) * limit;
        const users = await User.find().skip().limit();

        const total = await User.countDocuments();
        logger.info("User Fetched Successfully");
        res.status(200).json({
            message : "Users fetched successfully",
            success : true,
            totalPage :  Math.ceil(total/limit),
            user : users
        });
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error || "Internal Server Error",
            success : false
        });
    }
})

const getUserById = asyncErrorHandler(async(req,res)=>{
    try {
        const {id} = req.params;
        const user = await User.findById(id);
        logger.info(`User fetched with ${id}`)
        res.status(200).json({
            message : `User fetched with ${id}`,
            success : false,
            user
        });
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error || "Internal Server Error",
            success : false
        });
    }
});

/*
updateUserProfile = asyncErrorHandler(async(req,res)=>{
    res.send("update features pending...")
})
const resetPassword = asyncErrorHandler(async(req,res)=>{
    // send otp to the mail
    // verify otp
    // redirect to reset password page
    res.send("reset password eatures pending...");
})*/

export { 
    registerUser,
    loginUser,
    logoutUser,
    refreshToken,
    getUsers,
    getUserById
}