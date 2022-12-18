const express = require("express")
const app = express()
const expressWs = require("express-ws")(app)
const droneRouter = require("./controllers/drones")

app.use("/", droneRouter)
app.use("/api/blogs", droneRouter)

module.exports = app
