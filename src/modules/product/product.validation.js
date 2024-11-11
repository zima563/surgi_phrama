const Joi = require("joi");

const addProductVal = Joi.object({
    title: Joi.string().min(3).max(255).required(), // Title must be a string and between 3 to 255 characters.
    description: Joi.string().min(10).max(1000).required(), // Description must be a string between 10 and 1000 characters.
    brief: Joi.string().max(255).optional(), // Brief description is optional, but if provided, should be between 0 and 255 characters.
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
            .valid("image/png", "image/jpg", "image/jpeg")
            .required(),
        // destination: Joi.string().required(),
        // filename: Joi.string().required(),
        // path: Joi.string().required(),
        size: Joi.number().required(),
        buffer: Joi.any(),
    }).required(),
    categoryId: Joi.number().integer().required(), // Category ID must be a required integer.
    subCategoryId: Joi.number().integer().optional(), // Subcategory ID is optional, but if provided, should be an integer.
});


const updateProductVal = Joi.object({
    id: Joi.number().required(),

    title: Joi.string().min(3).max(255), // Title must be a string and between 3 to 255 characters.
    description: Joi.string().min(10).max(1000), // Description must be a string between 10 and 1000 characters.
    brief: Joi.string().max(255).optional(), // Brief description is optional, but if provided, should be between 0 and 255 characters.
    image: Joi.object({
        fieldname: Joi.string().required(),
        originalname: Joi.string().required(),
        encoding: Joi.string().required(),
        mimetype: Joi.string()
            .valid("image/png", "image/jpg", "image/jpeg")
            .required(),
        // destination: Joi.string().required(),
        // filename: Joi.string().required(),
        // path: Joi.string().required(),
        size: Joi.number().required(),
        buffer: Joi.any(),
    }),
    categoryId: Joi.number().integer(), // Category ID must be a required integer.
    subCategoryId: Joi.number().integer().optional(), // Subcategory ID is optional, but if provided, should be an integer.
});

module.exports = {
    addProductVal,
    updateProductVal
};
