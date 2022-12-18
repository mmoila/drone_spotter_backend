const mongoose = require("mongoose")
const Drone = require("../models/drones")
const Owner = require("../models/owners")
const app = require("../app")
//const { droneData } = require("./testHelper")

beforeEach(async () => {
  await Drone.deleteMany({})
  await Owner.deleteMany({})
  const owner = new Owner({
    firstName: "Pekka",
    lastName: "Pilotti",
    phoneNumber: "+358504856098",
    email: "pekka.pilotti@gmail.com",
  })
  await owner.save()
})

test("adding one drone to database", async () => {
  const owner = await Owner.findOne({ lastName: "Pilotti" })
  const drone = new Drone({
    timeStamp: new Date(Date.now()).toISOString(),
    serialNumber: "Serial-123",
    closestDistance: 400000.654,
    owner: owner._id,
  })
  const result = await drone.save()
  expect(result).toMatchObject(drone)
})

test("owner is populated when getting drone data", async () => {
  const owner = await Owner.findOne({ lastName: "Pilotti" })
  const drone = new Drone({
    timeStamp: new Date(Date.now()).toISOString(),
    serialNumber: "Serial-123",
    closestDistance: 400000.654,
    owner: owner._id,
  })
  await drone.save()
  const result = await Drone.findOne({}).populate("owner")
  expect(result.owner).toMatchObject(owner)
})

afterAll(() => {
  mongoose.connection.close()
})
