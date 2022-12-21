const express = require("express")
const app = express()
const { errorHandler } = require("./utils/middleware")
const mongoose = require("mongoose")
const config = require("./utils/config")
const { updateDroneData } = require("./utils/helpers")

require("express-async-errors")

setInterval(async () => {
  await updateDroneData()
}, 2000)

mongoose.set("strictQuery", false)
mongoose.connect(config.MONGODB_URI)

app.use(errorHandler)

module.exports = app
