const express = require("express")
const app = express()
const { errorHandler } = require("./utils/middleware")
const mongoose = require("mongoose")
const config = require("./utils/config")
const { updateDroneData, resetDatabase } = require("./utils/helpers")

require("express-async-errors")

mongoose.set("strictQuery", false)
mongoose.connect(config.MONGODB_URI)

const startPolling = () => {
  setInterval(async () => {
    await updateDroneData()
  }, 2000)
}

const connection = mongoose.connection
connection.on("connected", async () => {
  if (config.DATABASE_RESET) {
    await resetDatabase()
    startPolling()
  } else {
    startPolling()
  }
})

app.use(errorHandler)

module.exports = app
