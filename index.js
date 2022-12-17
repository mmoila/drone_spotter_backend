const express = require("express")
const axios = require("axios")
const app = express()
const expressWs = require("express-ws")(app)
const parseString = require("xml2js").parseString
const {
  parseDroneData,
  updateDroneData,
  parseOwnerData,
  combineDroneWithOwner,
} = require("./utils/helpers")
const { getDroneData, getDroneOwnerData } = require("./utils/droneQuery")

let droneDatabase = []

app.get("/", (req, res) => {
  res.send("<h1>Hello World!</h1>")
})

app.get("/api/drones", async (req, res) => {
  const droneData = await getDroneData()

  parseString(droneData, async (err, result) => {
    let droneList = parseDroneData(result)
    droneDatabase = updateDroneData(droneDatabase, droneList)
    droneDatabase = await combineDroneWithOwner(droneDatabase)
    res.json(droneDatabase)
  })
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

app.ws("/", (ws, req) => {
  ws.on("message", () => {
    setInterval(async () => {
      const droneData = await getDroneData()

      parseString(droneData, async (err, result) => {
        let droneList = parseDroneData(result)
        droneDatabase = updateDroneData(droneDatabase, droneList)
        droneDatabase = await combineDroneWithOwner(droneDatabase)
        ws.send(JSON.stringify(droneDatabase))
      })
    }, 5000)
  })
})

/*



    */
