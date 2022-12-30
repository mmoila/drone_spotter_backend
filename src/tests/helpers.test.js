const { droneData, ownerData, rawDroneData } = require("./testHelper")
const {
  getIntruderDrones,
  updateDroneData,
  withinNDZ,
  parseOwnerData,
  distanceFromNest,
  combineDronesWithOwners,
  parseDroneData,
} = require("../utils/helpers")

test("distance from nest is calculated correctly", () => {
  const position1 = [250000, 250000]
  const position2 = [350000, 250000]
  const position3 = [250000, 350001]
  const result1 = withinNDZ(distanceFromNest(position1))
  const resutl2 = withinNDZ(distanceFromNest(position2))
  const result3 = withinNDZ(distanceFromNest(position3))
  expect(result1).toBeTruthy()
  expect(resutl2).toBeTruthy()
  expect(result3).toBeFalsy()
})

test("drone xml data is parsed correctly", () => {
  const parsedDroneData = parseDroneData(rawDroneData)
  expect(parsedDroneData.length).toBe(4)
  expect(parsedDroneData[0]).toHaveProperty(
    "timeStamp",
    "serialNumber",
    "closestDistance",
    "position",
    "expireAt"
  )
  const dateObject = new Date(Date.parse(parsedDroneData[0].timeStamp))
  const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)

  expect(expireDate).toEqual(parsedDroneData[0].expireAt)
})

test("drone owner data is parsed correctly", () => {
  const userData = {
    pilotId: "P-HuIkB3R7PW",
    firstName: "Kadin",
    lastName: "MacGyver",
    phoneNumber: "+210310383952",
    createdDt: "2022-09-18T21:03:15.815Z",
    email: "kadin.macgyver@example.com",
  }
  expect(parseOwnerData(userData)).toMatchObject({
    name: "Kadin MacGyver",
    phoneNumber: "+210310383952",
    email: "kadin.macgyver@example.com",
  })
})

test("owner is combined with drones correctly", async () => {
  const droneList = await combineDronesWithOwners(droneData, (arg) => ownerData)
  droneList.forEach((drone) => {
    expect(drone.owner).toMatchObject({
      name: "Eric Kozey",
      phoneNumber: "+210965769601",
      email: "eric.kozey@example.com",
    })
  })
})

test("intruder drones are filtered correctly", () => {
  const intruders = getIntruderDrones(droneData, (data) => data)
  expect(intruders.length).toBe(3)
})
