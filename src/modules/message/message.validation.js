const Joi = require("joi");

const messageValidationSchema = Joi.object({
    firstName: Joi.string().min(2).max(50).required().messages({
        "string.base": "First name must be a string",
        "string.empty": "First name is required",
        "string.min": "First name must be at least 2 characters",
        "string.max": "First name must be at most 50 characters",
    }),
    lastName: Joi.string().min(2).max(50).required().messages({
        "string.base": "Last name must be a string",
        "string.empty": "Last name is required",
        "string.min": "Last name must be at least 2 characters",
        "string.max": "Last name must be at most 50 characters",
    }),
    phone: Joi.string().pattern(/^[0-9]+$/).min(10).max(15).required().messages({
        "string.empty": "Phone number is required",
        "string.pattern.base": "Phone number can only contain numbers",
        "string.min": "Phone number must be at least 10 digits",
        "string.max": "Phone number must be at most 15 digits",
    }),
    email: Joi.string().email().required().messages({
        "string.empty": "Email is required",
        "string.email": "Email must be a valid email address",
    }),
    message: Joi.string().min(5).max(2500).required().messages({
        "string.empty": "Message is required",
        "string.min": "Message must be at least 5 characters",
        "string.max": "Message must be at most 2500 characters",
    }),
}).unknown(true) // Allow unknown fields in the object


module.exports = { messageValidationSchema };
