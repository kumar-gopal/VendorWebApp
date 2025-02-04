import Joi from "joi";

const validateVendor = (data) => {
  const schema = Joi.object({
    companyName: Joi.string()
      .required()
      .trim()
      .messages({
        "string.base": "Company name must be a string.",
        "string.empty": "Company name cannot be empty.",
        "any.required": "Company name is required.",
      }),

    email: Joi.string()
      .email()
      .required()
      .messages({
        "string.email": "Please enter a valid email address.",
        "string.empty": "Email cannot be empty.",
        "any.required": "Email is required.",
      }),

    vendorId: Joi.string().optional(),

    password: Joi.string()
      .min(8)
      .pattern(
        new RegExp("^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$")
      )
      .required()
      .messages({
        "string.min": "Password must be at least 8 characters long.",
        "string.pattern.base":
          "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character.",
        "any.required": "Password is required.",
      }),

    role: Joi.string()
      .valid("vendor")
      .default("vendor")
      .messages({
        "any.only": "Role must be 'vendor'.",
      }),

    phone: Joi.string()
      .pattern(/^\+?[1-9]\d{1,14}$/)
      .required()
      .messages({
        "string.pattern.base": "Please enter a valid phone number.",
        "any.required": "Phone number is required.",
      }),

    address: Joi.string()
      .required()
      .messages({
        "any.required": "Address is required.",
      }),

    website: Joi.string()
      .uri()
      .optional()
      .trim()
      .messages({
        "string.uri": "Please enter a valid website URL.",
      }),

    products: Joi.array()
      .items(Joi.string())
      .optional()
      .messages({
        "array.base": "Products must be an array of IDs.",
      }),

    status: Joi.string()
      .valid("Active", "Inactive", "Suspended")
      .default("Inactive")
      .messages({
        "any.only": "Status must be one of 'Active', 'Inactive', or 'Suspended'.",
      }),

    paymentInfo: Joi.object({
      bankAccountNumber: Joi.string()
        .required()
        .messages({
          "string.empty": "Bank account number is required.",
          "any.required": "Bank account number is required.",
        }),
      bankName: Joi.string()
        .required()
        .messages({
          "string.empty": "Bank name is required.",
          "any.required": "Bank name is required.",
        }),
      ifscCode: Joi.string()
        .required()
        .messages({
          "string.empty": "IFSC code is required.",
          "any.required": "IFSC code is required.",
        }),
    }).required(),
  });

  return schema.validate(data, { abortEarly: false }); // Validate all fields before returning
};


export { validateVendor };
