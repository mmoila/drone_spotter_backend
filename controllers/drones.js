const droneRouter = require("express").Router()
const parseString = require("xml2js").parseString
const {
  parseDroneData,
  combineDroneWithOwner,
  getIntruderDrones,
} = require("../utils/helpers")
const { getDroneData } = require("../utils/droneQuery")
const Drone = require("../models/drones")

const updateDroneData = async () => {
  const droneData = await getDroneData()

  parseString(droneData, async (err, result) => {
    let droneList = await combineDroneWithOwner(getIntruderDrones(result))

    droneList.forEach(async (drone) => {
      const query = { serialNumber: drone.serialNumber }
      const oldDrone = await Drone.findOneAndReplace(query, drone)
      if (oldDrone) {
        await Drone.findOneAndUpdate(query, {
          closestDistance: Math.min(
            drone.closestDistance,
            oldDrone.closestDistance
          ),
        })
      } else {
        await new Drone(drone).save()
      }
    })
  })
}

droneRouter.ws("/", (ws, req) => {
  ws.on("message", () => {
    setInterval(async () => {
      const oldDrones = await Drone.find({})
      await updateDroneData()
      const drones = await Drone.find({})
      if (JSON.stringify(oldDrones) === JSON.stringify(drones)) {
        ws.send(JSON.stringify(drones))
      }
    }, 2000)
  })
})

//for testing purposes
droneRouter.get("/api/drones", async (req, res) => {
  await updateDroneData()
  const drones = await Drone.find({})
  res.json(drones)
})

module.exports = droneRouter
