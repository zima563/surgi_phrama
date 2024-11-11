const Joi = require("joi");

const addSubCategoryVal = Joi.object({
    name: Joi.string().min(3).max(255).required(), // Validate 'name' to be a string, at least 3 characters, and at most 255
    parentId: Joi.number().required()
});

const updateSubCategoryVal = Joi.object({
    id: Joi.number().required(),

    name: Joi.string().min(3).max(255), // Validate 'name' to be a string, at least 3 characters, and at most 255
    parentId: Joi.number()
});

module.exports = {
    addSubCategoryVal,
    updateSubCategoryVal
};
