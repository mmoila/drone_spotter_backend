const WebSocket = require("ws")
const http = require("http")
const app = require("./app")
const { emitter } = require("./utils/helpers")
const Drone = require("./models/drones")

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

wss.on("connection", (ws) => {
  console.log("Websocket connection established")
  emitter.removeAllListeners()

  emitter.on("DronesUpdated", async () => {
    const drones = await Drone.find({})
    ws.send(JSON.stringify(drones))
  })

  ws.on("message", () => {
    console.log("message received")
  })
})

module.exports = server
