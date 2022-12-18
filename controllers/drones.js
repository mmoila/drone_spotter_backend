const droneRouter = require("express").Router()
const parseString = require("xml2js").parseString
const {
  parseDroneData,
  updateDroneData,
  combineDroneWithOwner,
} = require("../utils/helpers")
const { getDroneData } = require("../utils/droneQuery")

let droneDatabase = []

droneRouter.ws("/", (ws, req) => {
  ws.on("message", () => {
    setInterval(async () => {
      const droneData = await getDroneData()

      parseString(droneData, async (err, result) => {
        let droneList = parseDroneData(result)
        const oldDroneData = droneData
        droneDatabase = updateDroneData(droneDatabase, droneList)
        droneDatabase = await combineDroneWithOwner(droneDatabase)
        if (droneDatabase.length > 0) {
          ws.send(JSON.stringify(droneDatabase))
        }
      })
    }, 2000)
  })
})

droneRouter.get("/api/drones", async (req, res) => {
  const droneData = await getDroneData()

  parseString(droneData, async (err, result) => {
    let droneList = parseDroneData(result)
    droneDatabase = updateDroneData(droneDatabase, droneList)
    droneDatabase = await combineDroneWithOwner(droneDatabase)
    res.json(droneDatabase)
  })
})

module.exports = droneRouter
