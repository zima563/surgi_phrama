const joi = require("joi");
const { register } = require("./user.controller");

const registerVal = joi.object({
    userName: joi.string().min(2).max(50).required(),
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/),
});

const loginVal = joi.object({
    email: joi.string().email().required(),
    password: joi.string().pattern(/^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/).required(),
});

module.exports = {
    registerVal,
    loginVal
}