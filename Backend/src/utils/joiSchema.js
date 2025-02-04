import Joi from "joi";

// Define the schema once for reusability
const signUpSchema = Joi.object({
  username: Joi.string()
    .alphanum()
    .min(3)
    .max(30)
    .required()
    .messages({
      "string.base": "Username must be a string.",
      "string.empty": "Username cannot be empty.",
      "string.min": "Username must be at least 3 characters.",
      "string.max": "Username must not exceed 30 characters.",
      "any.required": "Username is required.",
    }),
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

const validateSignUp = (data) => {
  return signUpSchema.validate(data, { abortEarly: false }); // Return all errors
};
// Define the schema once for reusability
const signInSchema = Joi.object({
  email: Joi.string()
    .email()
    .required()
    .messages({
      "string.email": "Email must be a valid email address.",
      "any.required": "Email is required.",
    }),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!%*?&])[A-Za-z0-9@$!%*?&]{8,}$"
      )
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number, and one special character.",
      "any.required": "Password is required.",
    }),
});

const validateSignIn = (data) => {
  return signInSchema.validate(data, { abortEarly: false }); // Return all errors
};


export { validateSignUp , validateSignIn };
