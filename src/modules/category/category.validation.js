const Joi = require("joi");

const addCategoryVal = Joi.object({
    name: Joi.string().min(3).max(255).required(), // Validate 'name' to be a string, at least 3 characters, and at most 255
});

const updateCategoryVal = Joi.object({
    id: Joi.number().required(),

    name: Joi.string().min(3).max(255), // Validate 'name' to be a string, at least 3 characters, and at most 255
});

module.exports = {
    addCategoryVal,
    updateCategoryVal
};
