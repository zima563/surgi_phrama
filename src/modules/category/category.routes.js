const express = require("express");
const { protectRoutes } = require("../user/user.controller");
const validation = require("../../middlewares/validation");
const { addCategory, getAllCategory, getCategory, updateCategory, deleteCategory } = require("./category.controller");
const { addCategoryVal, updateCategoryVal } = require("./category.validation");

const categoryRouter = express.Router();

categoryRouter.route("/").post(protectRoutes, validation(addCategoryVal), addCategory).get(getAllCategory);

categoryRouter.route("/:id").get(getCategory).put(validation(updateCategoryVal), updateCategory).delete(deleteCategory);

module.exports = categoryRouter;