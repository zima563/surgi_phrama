const express = require("express");
const { protectRoutes } = require("../user/user.controller");
const { addProductVal, updateProductVal } = require("./product.validation");
const { addProduct, getAllProduct, getProduct, updateProduct, deleteProduct } = require("./product.controller");
const validation = require("../../middlewares/validation");
const { uploadSingleFile } = require("../../middlewares/upload");

const productRouter = express.Router();

productRouter.route("/").post(protectRoutes, uploadSingleFile("img"), validation(addProductVal), addProduct).get(getAllProduct);

productRouter.route("/:id").get(getProduct).put(protectRoutes, uploadSingleFile("img"), validation(updateProductVal), updateProduct).delete(protectRoutes, deleteProduct);

module.exports = productRouter;