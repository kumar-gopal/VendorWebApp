import Joi from "joi";

const orderItemSchema = Joi.object({
    productId: Joi.string().required().regex(/^[a-f\d]{24}$/i).message("Invalid Product ID format."),
    quantity: Joi.number().required().min(1).message("Quantity must be at least 1."),
    price: Joi.number().required().message("Price is required."),
});

const orderSchema = Joi.object({
    // customer: Joi.string().required().regex(/^[a-f\d]{24}$/i).message("Invalid Customer ID format."),
    items: Joi.array().items(orderItemSchema).min(1).required().message("At least one item is required."),
    totalAmount: Joi.number().required().min(0).message("Total amount must be a positive number."),
    shippingAddress: Joi.string().required().regex(/^[a-f\d]{24}$/i).message("Invalid Address ID format."),
    paymentMethod: Joi.string()
        .valid("Credit Card", "PayPal", "Bank Transfer")
        .required()
        .message("Payment method must be one of 'Credit Card', 'PayPal', or 'Bank Transfer'."),
    status: Joi.string()
        .valid("Pending", "Shipped", "Delivered", "Cancelled")
        .default("Pending"),
    paymentStatus: Joi.string()
        .valid("Pending", "Completed", "Failed")
        .default("Pending"),
    trackingNumber: Joi.string().optional().allow(null).message("Tracking number can be null or a string."),
});

const validateOrderData = (data) => {
    return orderSchema.validate(data, { abortEarly: false });
};

export { validateOrderData };
