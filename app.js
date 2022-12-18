const express = require("express")
const app = express()
const expressWs = require("express-ws")(app)
const droneRouter = require("./controllers/drones")
const { errorHandler } = require("./utils/middleware")
const mongoose = require("mongoose")
const config = require("./utils/config")

require("express-async-errors")

mongoose.set("strictQuery", false)
mongoose.connect(config.MONGODB_URI)

app.use("/", droneRouter)
app.use("/api/blogs", droneRouter)
app.use(errorHandler)

module.exports = app
