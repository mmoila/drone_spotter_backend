const droneRouter = require("express").Router()
const {
  combineDroneWithOwner,
  getIntruderDrones,
  updateDroneData,
} = require("../utils/helpers")
const Drone = require("../models/drones")

//for testing purposes
droneRouter.get("/api/drones", async (req, res) => {
  await updateDroneData()
  const drones = await Drone.find({})
  res.json(drones)
})

module.exports = droneRouter
