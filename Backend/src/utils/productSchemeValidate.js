import Joi from 'joi';

// Validation schema for product creation
const createProductValidationSchema = Joi.object({
  name: Joi.string().trim().required(),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // MongoDB ObjectId format
  baseDetails: Joi.object({
    brand: Joi.string().trim().required(),
    price: Joi.number().min(0).required(),
    currency: Joi.string().valid("USD", "EUR", "GBP", "INR").default("USD"), // Example multi-currency validation
    stock: Joi.number().min(0).default(0),
  }).required(),
  customAttributes: Joi.object().pattern(Joi.string(), Joi.any()).default({}), // Allows dynamic key-value pairs for each product category
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri().required(),
      altText: Joi.string().trim(),
      isPrimary: Joi.boolean().default(false),
    })
  ).min(1).required(), // Ensure at least one image is provided
  seller: Joi.string().pattern(/^[0-9a-fA-F]{24}$/).required(), // MongoDB ObjectId format for Vendor reference
  ratings: Joi.object({
    average: Joi.number().min(0).max(5).default(0),
    count: Joi.number().min(0).default(0),
  }).required(),
  reviews: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)), // Array of Review ObjectId references
  status: Joi.string().valid("Active", "Inactive", "Draft").default("Active"),
});

// Validation schema for product update
const updateProductValidationSchema = Joi.object({
  name: Joi.string().trim(),
  category: Joi.string().pattern(/^[0-9a-fA-F]{24}$/), // MongoDB ObjectId format
  baseDetails: Joi.object({
    brand: Joi.string().trim(),
    price: Joi.number().min(0),
    currency: Joi.string().valid("USD", "EUR", "GBP", "INR"),
    stock: Joi.number().min(0),
  }),
  customAttributes: Joi.object().pattern(Joi.string(), Joi.any()),
  images: Joi.array().items(
    Joi.object({
      url: Joi.string().uri(),
      altText: Joi.string().trim(),
      isPrimary: Joi.boolean(),
    })
  ),
  seller: Joi.string().pattern(/^[0-9a-fA-F]{24}$/),
  ratings: Joi.object({
    average: Joi.number().min(0).max(5),
    count: Joi.number().min(0),
  }),
  reviews: Joi.array().items(Joi.string().pattern(/^[0-9a-fA-F]{24}$/)),
  status: Joi.string().valid("Active", "Inactive", "Draft"),
}).min(1); // At least one field must be provided for updating

const validateCreateProductData = (data) => {
  return createProductValidationSchema.validate(data, { abortEarly: false }); // Return all errors
};

const validateupdateProductData = (data) => {
    return updateProductValidationSchema.validate(data, { abortEarly: false }); // Return all errors
};