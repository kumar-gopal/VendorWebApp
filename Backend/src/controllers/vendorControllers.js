import {Vendor} from "../model/vendor.model.js";
import {validateVendor} from "../utils/vendorSchemavalidate.js";
import {logger} from "../utils/logger.js";
import crypto from "crypto";
import {asyncErrorHandler} from "../middleware/errorHandler.js";
import Jwt from "jsonwebtoken";


const vendorSignup = asyncErrorHandler(async(req,res)=>{
    logger.info(`Vendor SignUp Api Endpoint hit`);
    const {value,error} = validateVendor(req.body);
    if(error){
        logger.warn(`Schema Validation Failed`);
        return res.status(400).json({
            message : "Schema Validation Failed",
            success : false
        });
    }

    try {
        const {email} = value;
        const vendor = await Vendor.findOne({email});
        if(vendor){
            logger.info(`Vendor is already exists`);
            return res.status(400).json({
                message : "Vendor is already exists",
                success : false
            });
        }

        const newVendor = await Vendor({
            ...req.body
        });

        await newVendor.save();
        res.status(201).json({
            message : "Vendor is registered successfully",
            success : true
        });

    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }
});


const vendorSignInstep = asyncErrorHandler(async(req,res)=>{
    try {
        const {email} = req.body;

        if(!email){
            return res.status(400).json({
                message : "Email is required",
                success : false
            });
        }

        const vendor = await Vendor.findOne({email});
        if(!vendor){
            logger.warn("Vendor doesn't exists");
            return res.status(400).json({
                message : "Vendor doesn't exists",
                success : false
            });
        }


         // Generate unique ID and one-time password
        const generatedId = `VENDOR-${crypto.randomBytes(4).toString("hex")}`;
        const generatedPassword = crypto.randomBytes(8).toString("hex");
        await Vendor.findByIdAndUpdate(vendor._id,{
            vendorId : generatedId,
            password : generatedPassword
        });
        logger.info(`Vendor id and password sent to the your email`);
        res.status(201).json({
            message : "Vendor id and password sent to the your email",
            success : true,
            vendorId : generatedId,
            password : generatedPassword
        })
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }
});

const vendorSignIn = asyncErrorHandler(async(req,res)=>{
    try {
        const { vendorId,password } = req.body;
    
        if(!vendorId  || !password ){
            logger.info(`Input validation failed`);
            return res.status(400).json({
                message : "Input validation failed",
                success : false
            });
        }

        const vendor = await Vendor.findOne({vendorId});
        if(!vendor){
            logger.warn(`you have entered incorrect vendorId`);
           return res.status(400).json({
                message : "you have entered incorrect vendorId",
                success : false
            });
        }
        if(vendor.password !== password){
            logger.info("you have entered incorrect password");
           return res.status(400).json({
                message : "you have entered incorrect password",
                success : false
            });
        }

        await Vendor.updateOne(
            {vendorId},            
            { $set: { vendorId: "", password: "" } }, 
            { upsert: false }        
        );

        const accessToken = Jwt.sign(
                {
                    id: vendor._id,
                    role : Vendor.role
                },
                process.env.VENDOR_JWT_SECRET,
                { expiresIn : process.env.VENDOR_JWT_TOKEN_EXPIRY}
            );
        logger.info("vendor is logged in successfully");
        res.status(200).json({
            message : "vendor is logged in successfully",
            success : true,
            accessToken : accessToken,
            vendor
        });
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }

});

const getvendors = asyncErrorHandler(async(req,res)=>{
    try {
        const vendors = await Vendor.find();
        return res.status(200).json({
            message : "vendor is successfully fetched",
            success : true,
            vendors
        });
    } catch (error) {
        logger.error("Internal Server Error");
        res.status(500).json({
            message : error.message || "Internal Server Error",
            success : false
        });
    }
})
export { vendorSignup,vendorSignInstep,vendorSignIn,getvendors };