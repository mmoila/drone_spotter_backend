const mongoose = require("mongoose")
const Drone = require("../models/drones")
const app = require("../app")

beforeEach(async () => {
  await Drone.deleteMany({})
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

afterAll(() => {
  mongoose.connection.close()
})
