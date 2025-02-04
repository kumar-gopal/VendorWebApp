import { Product } from "../model/product.model.js";
import { logger } from "../utils/logger.js";
import { asyncErrorHandler } from "../middleware/errorHandler.js"

import uploadMultipleImagesOnCloudinary  from '../utils/cloudinary.js';


/*🔍 Basic Filters (Common for All Products)
These filters work across different product categories.

Filter Name	Description	Example
Category	Filter by product category	"Electronics", "Clothing", "Furniture"

Brand	Show products from specific brands	"Apple", "Nike", "Samsung"

Price Range	Filter products within a price range	$10 - $50, $100 - $500

Discounts & Offers	Show products with discounts	"10% off", "Buy 1 Get 1 Free"

Availability	Show only in-stock items	"In Stock", "Out of Stock"

Ratings & Reviews	Filter by customer ratings	⭐⭐⭐⭐⭐ (5-star and above)

New Arrivals	Show latest products	"Last 7 Days", "Last 30 Days"*/
/*
app.get("/products", async (req, res) => {
    const { category, minPrice, maxPrice, brand, rating } = req.query;

    let filter = {}; // Empty filter object

    if (category) filter.category = category;
    if (brand) filter.brand = brand;
    if (minPrice && maxPrice) filter["baseDetails.price"] = { $gte: minPrice, $lte: maxPrice };
    if (rating) filter["ratings.average"] = { $gte: rating };

    try {
        const products = await Product.find(filter);
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: "Server Error", error });
    }
});*/


// Create Product with Multiple Image Uploads
export const createProduct = async (req, res) => {
    try {
        const { error, value } = validateCreateProductData(req.body);
        if (error) {
            logger.warn(`Input Validation Failed ${error.details[0]?.message}`);
            return res.status(400).json({
                message: "Input Validation Failed",
                success: false,
                error: error.details[0]?.message
            });
        }
        const { name, description, price, category, customAttributes } = value;
        const imageFiles = req.files; // Multer uploaded files

        // Upload images to Cloudinary
        let imageUrls = [];
        if (imageFiles && imageFiles.length > 0) {
            const uploadResults = await uploadMultipleImagesOnCloudinary(imageFiles.map(file => file.path));
            if (Array.isArray(uploadResults)) {
                imageUrls = uploadResults
                    .filter(result => "secure_url" in result) // Filter successful uploads
                    .map(result => result.secure_url); // Extract URLs
            }
        }

        // Create product with uploaded images
        const product = new Product({
            name,
            description,
            price,
            category,
            stock,
            images: imageUrls,
            seller: req.vendor.id,
            ratings,
            customAttributes,
        });

        const savedProduct = await product.save();
        logger.inf("Product is created successfully");
        res.status(201).json({
            message: "Product is created successfully",
            success: true,
            product: savedProduct
        });
    } catch (error) {
        logger.error("Error creating product:", error);
        res.status(500).json({
            message: "Internal Server Error",
            success: false,
            error: error.message
        });
    }
};

// Update Product with Multiple Image Uploads
export const updateProduct = async (req, res) => {
    try {
        const { error, value } = updateProductValidationSchema(req.body);
        if (error) {
            logger.warn(`Input Validation Failed ${error.details[0]?.message}`);
            return res.status(400).json({
                message: "Input Validation Failed",
                success: false,
                error: error.details[0]?.message
            });
        }
        const imageFiles = req.files; // Multer uploaded files



        // Find existing product
        const existingProduct = await Product.findByProductId(req.params.id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Preserve old images if no new ones are uploaded
        let imageUrls = existingProduct.images;

        // Upload new images if available
        if (imageFiles && imageFiles.length > 0) {
            const uploadResults = await uploadMultipleImagesOnCloudinary(imageFiles.map(file => file.path));
            let newImageUrls = [];
            if (Array.isArray(uploadResults)) {
                newImageUrls = uploadResults
                    .filter(result => "secure_url" in result)
                    .map(result => result.secure_url);
            }

            // Append new images to existing ones
            imageUrls = [...imageUrls, ...newImageUrls];
        }

        // Update product with new data
        const updatedProduct = await Product.updateProductById(
            req.params.id,
            {
                ...value,
                images: imageUrls,
            },
            { new: true, runValidators: true } // Ensure validation is run when updating
        );

        if (!updatedProduct) {
            return res.status(404).json({ message: "Product update failed" });
        }

        res.json(updatedProduct); // Return updated product
    } catch (error) {
        console.error("Error updating product:", error); // Log error for debugging
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


// 2. Get all products (with optional filters)
export const getProducts = asyncErrorHandler(async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 5;

        const skip = (page - 1) * limit;

        const products = await Product.findAllProducts().skip(skip).limit(limit);

        const totalCount = await Product.countDocuments();

        logger.info("Product fetched successfully !!");
        res.status(200).json({
            success: true,
            pagination: {
                total: totalCount,
                page,
                limit,
                totalPages: Math.ceil(totalCount / limit)
            },
            data: products,
        });

    } catch (error) {
        logger.info("Error retrieving products !!");
        res.status(500).json({
            success: false,
            message: "Error retrieving products",
            error: error.message,
        });
    }
});

// 3. Get a product by ID
export const getProductById = asyncErrorHandler(async (req, res) => {
    logger.info("getProductById api endpoint hit");
    try {
        const { id } = req.params;
        const product = await Product.findByProductId(id);
        if (!product) {
            logger.info("Product not found");
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        logger.info("Product not found");
        res.status(200).json({
            success: true,
            message: "Product retrieved successfully",
            data: product,
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Error retrieving product",
            error: error.message,
        });
    }
});

// 4. Update a product by ID


// 5. Delete a product by ID
export const deleteProduct = asyncErrorHandler(async (req, res) => {
    logger.info("deleteProduct api endpoints ");
    try {
        const { id } = req.params; // Product ID from URL
        const deletedProduct = await Product.deleteProductById(id); // Delete product
        if (!deletedProduct) {
            logger.info("Product not found ");
            return res.status(404).json({
                success: false,
                message: "Product not found",
            });
        }
        logger.info("Product deleted successfully");
        res.status(200).json({
            success: true,
            message: "Product deleted successfully",
            data: deletedProduct,
        });
    } catch (error) {
        logger.info("Error deleting product");
        res.status(500).json({
            success: false,
            message: "Error deleting product",
            error: error.message,
        });
    }
});



