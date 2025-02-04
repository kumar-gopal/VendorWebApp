import Joi from "joi";

// Address validation schema
const addressSchema = Joi.object({
    street: Joi.string()
        .required()
        .messages({ "any.required": "Street is required." }),
    city: Joi.string()
        .required()
        .messages({ "any.required": "City is required." }),
    state: Joi.string()
        .required()
        .messages({ "any.required": "State is required." }),
    postalCode: Joi.string()
        .pattern(/^\d{5}(-\d{4})?$/, "postal code") 
        .required()
        .messages({
            "string.pattern.name": "postalCode must be a valid ZIP code.",
            "any.required": "Postal code is required.",
        }),
});

// Validation function
const validateAddressData = (data) => {
    return addressSchema.validate(data, { abortEarly: false });
};

export { validateAddressData };
