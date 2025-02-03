const express = require('express')
const dotenv = require("dotenv")
const compression = require("compression")
const cors = require("cors")
const routes = require('./src/index.routes')
const app = express()

dotenv.config()


app.use("/", express.static("uploads/"));
app.use(compression());
app.use(express.json())
app.use(cors({ origin: process.env.URL }))
routes(app);

app.listen(process.env.PORT, () => console.log(`Example app listening on port ${process.env.PORT}!`))