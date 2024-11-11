const express = require('express')
const dotenv = require("dotenv")
const compression = require("compression")
const cors = require("cors")
const routes = require('./src/index.routes')
const app = express()
const port = 4000
dotenv.config()


app.use("/", express.static("uploads/"));
app.use(compression());
app.use(express.json())
app.use(cors())
routes(app);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))