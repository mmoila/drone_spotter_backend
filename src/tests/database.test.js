const mongoose = require("mongoose")
const Drone = require("../models/drones")
const app = require("../app")
const { updateDroneDatabase } = require("../utils/helpers")
const { droneData } = require("./testHelper")

beforeEach(async () => {
  if (mongoose.connection.readyState !== 1) {
    mongoose.connection.on("connected", async () => {
      await Drone.deleteMany({})
    })
  } else {
    await Drone.deleteMany({})
  }
})

test("adding one drone to database", async () => {
  const dateString = new Date(Date.now()).toISOString()
  const dateObject = new Date(Date.parse(dateString))
  const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)
  const drone = new Drone({
    timeStamp: dateString,
    serialNumber: "Serial-124",
    closestDistance: 300000.654,
    owner: {
      name: "Pekka Pilotti",
      phoneNumber: "+358504856098",
      email: "pekka.pilotti@gmail.com",
    },
    expireAt: expireDate,
  })
  const result = await drone.save()
  expect(result).toMatchObject(drone)
})

describe("When trying to update existing drone to database", () => {
  const dateString = new Date(Date.now()).toISOString()

  test("closer observation is saved with new distance", async () => {
    const drone1 = await new Drone(droneData[0]).save()
    const updatedDroneList = [
      {
        serialNumber: drone1.serialNumber,
        closestDistance: drone1.closestDistance - 1000,
        timeStamp: dateString,
        expireAt: "2026-01-01T00:00:00.000Z",
        position: [],
      },
    ]

    await updateDroneDatabase(updatedDroneList)
    const droneFromDatabase = await Drone.findOne({})

    expect(droneFromDatabase.closestDistance).toBe(
      drone1.closestDistance - 1000
    )
    expect(droneFromDatabase.timeStamp.toISOString()).toBe(dateString)
    expect(droneFromDatabase.expireAt.toISOString()).toBe(
      "2026-01-01T00:00:00.000Z"
    )
  })

  test("further observation is saved with old distance", async () => {
    const drone2 = await new Drone(droneData[droneData.length - 1]).save()
    const updatedDroneList = [
      {
        serialNumber: drone2.serialNumber,
        closestDistance: drone2.closestDistance + 1000,
        timeStamp: dateString,
        expireAt: "2026-01-01T00:00:00.000Z",
        position: [],
      },
    ]

    await updateDroneDatabase(updatedDroneList)
    const droneFromDatabase = await Drone.findOne({})

    expect(droneFromDatabase.closestDistance).toBe(drone2.closestDistance)
    expect(droneFromDatabase.timeStamp.toISOString()).toBe(dateString)
    expect(droneFromDatabase.expireAt.toISOString()).toBe(
      "2026-01-01T00:00:00.000Z"
    )
  })
})

afterAll(async () => {
  await mongoose.connection.close()
})
