const express = require("express");
const { addMessage, getAllMessage } = require("./message.controller");
const validation = require("../../middlewares/validation");
const { messageValidationSchema } = require("./message.validation");
const { protectRoutes } = require("../user/user.controller");

const messageRouter = express.Router();

messageRouter.route("/").post(validation(messageValidationSchema), addMessage).get(protectRoutes, getAllMessage);



module.exports = messageRouter;