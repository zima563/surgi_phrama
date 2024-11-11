const express = require("express");
const { protectRoutes } = require("../user/user.controller");
const validation = require("../../middlewares/validation");
const { addSubCategoryVal, updateSubCategoryVal } = require("./subCategory.validation");
const { addSubCategory, getAllSubCategory, getSubCategory, updateSubCategory, deleteSubCategory } = require("./subCategory.controller")

const subCategoryRouter = express.Router();

subCategoryRouter.route("/").post(protectRoutes, validation(addSubCategoryVal), addSubCategory).get(getAllSubCategory);

subCategoryRouter.route("/:id").get(getSubCategory).put(protectRoutes, validation(updateSubCategoryVal), updateSubCategory).delete(protectRoutes, deleteSubCategory);

module.exports = subCategoryRouter;