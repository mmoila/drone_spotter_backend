const WebSocket = require("ws")
const http = require("http")
const app = require("./app")
const Drone = require("./models/drones")

const server = http.createServer(app)
const wss = new WebSocket.Server({ server })

const sendDroneData = async (ws) => {
  let drones = await Drone.find({
    expireAt: { $gte: new Date() },
  }).exec()

  ws.send(JSON.stringify(drones))

  setInterval(async () => {
    drones = await Drone.find({
      expireAt: { $gte: new Date() },
    }).exec()
    ws.send(JSON.stringify(drones))
  }, 2000)
}

wss.on("connection", async (ws) => {
  console.log("Websocket connection established")
  await sendDroneData(ws)

  ws.on("message", () => {
    console.log("message received")
  })

  ws.on("close", () => {
    console.log("websocket disconnected")
  })
})

module.exports = server
