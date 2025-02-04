
import {Address} from "../model/address.model.js"; 
import { logger } from "../utils/logger.js";
import {validateAddressData} from "../utils/addressSchemaValidation.js";

// Create a new address
export const createAddress = async (req, res) => {
    logger.info(`Address Creation Api Endpoints hit`);
    const {error,value} = validateAddressData(req.body);
    if (error) {
        logger.warn("Validation failed");
        return res.status(400).json({
            message : error.details[0]?.message || "Validation Failed",
            success : false,
        });
    }

    const {street, city, state, postalCode} = value;
    try {
        
        console.log("user id -",req.user.id);
        
        const newAddress = new Address({ 
            userId : req.user.id,
            street, 
            city, 
            state, 
            postalCode 
        });
        const savedAddress = await newAddress.save();
        logger.info(`Address has beed Saved Successfully`);
        res.status(201).json({
            message : `Address has beed Saved Successfully`,
            success : false,
            data : savedAddress
        });
    } catch (error) {
        logger.warn(`Internal Server Error`);
        res.status(500).json({ 
            message: "Error creating address.", 
            success : false,
            error: error.message ||`Internal Server Error`,
        });
    }
};

export const getAllAddresses = async(req,res)=>{
    const address = await Address.find();
    res.json({
       message : "working...",
       address
    });
}
// Get a single address by ID
export const getAddressById = async (req, res) => {
    try {
        const { id } = req.params;
        const address = await Address.findById(id).populate("userId", "username email");

        if (!address) {
            return res.status(404).json({ 
                message: "Address not found." ,
                success : false
            });
        }

        logger.info(`Address is successfully fetched with specific Id`);
        res.status(200).json({
            message :` Address is successfully fetched with specific Id`,
            success : true,
            data : address
        });
    } catch (error) {
        logger.warn(`Internal Server Error`);
        res.status(500).json({ 
            message: "Error fetching while geting a address by id.", 
            success : false,
            error: error.message 
        });
    }
};

// Update an address by ID
export const updateAddress = async (req, res) => {
    try {
        const { id } = req.params;
        const {error,value} = validateAddressData(req.body);
        if (error) {
            logger.warn("Validation failed");
            return res.status(400).json({
                message : error.details[0]?.message || "Validation Failed",
                success : false,
            });
        }
        const updatedAddress = await Address.findByIdAndUpdate(
            id, 
            value, 
            { 
                new: true 
            }
        );

        if (!updatedAddress) {
            logger.warn("Address not found.");
            return res.status(404).json({ 
                message: "Address not found." ,
                success : false
            });
        }

        res.status(200).json({
            message : "Address is successfully updated",
            success : true,
            data : updatedAddress
        });
    } catch (error) {
        logger.warn(`Internal Server Error`);
        res.status(500).json({ 
            message: "Error fetching addresses.", 
            success : false,
            error: error.message 
        });
    }
};

// Delete an address by ID
export const deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;

        const deletedAddress = await Address.findByIdAndDelete(id);

        if (!deletedAddress) {
            logger.info("Address not found.",error.message);
            return res.status(404).json({ 
                message: "Address not found." ,
                success : false
            });
        }
        logger.info("Address deleted successfully.");
        res.status(200).json({
             message: "Address deleted successfully." ,
             success : true,
             deletedAddress
        });
    } catch (error) {
        res.status(500).json({ message: "Error deleting address.", error: error.message });
    }
};
