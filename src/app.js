const express = require("express")
const app = express()
const expressWs = require("express-ws")(app)
const droneRouter = require("./controllers/drones")
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

app.use("/api/blogs", droneRouter)
app.on("newDroneData", () => console.log("emitter called"))
app.use(errorHandler)

module.exports = app
