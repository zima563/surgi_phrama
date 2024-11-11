const { globalError } = require("./middlewares/globalError");
const categoryRouter = require("./modules/category/category.routes");
const messageRouter = require("./modules/message/message.routes");
const productRouter = require("./modules/product/product.routes");
const subCategoryRouter = require("./modules/subCategory/subCategory.routes");
const userRouter = require("./modules/user/user.routes");
const apiError = require("./utils/apiError");


const routes = (app) => {

    app.use("/api/categories", categoryRouter);
    app.use("/api/subCategories", subCategoryRouter);
    app.use("/api/products", productRouter);
    app.use("/api/auth", userRouter);
    app.use("/api/messages", messageRouter);
    app.get('/', (req, res) => res.send('Hello World!'))


    app.use(globalError)
}

module.exports = routes;