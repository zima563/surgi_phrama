const express = require("express");
const validation = require("../../middlewares/validation");
const { loginVal, registerVal } = require("./user.validation");
const { login, register } = require("./user.controller");

const userRouter = express.Router();

userRouter.route("/login").post(validation(loginVal), login);

userRouter.route("/register").post(validation(registerVal), register);

module.exports = userRouter;