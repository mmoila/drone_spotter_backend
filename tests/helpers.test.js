const { droneData, ownerData } = require("./testHelper")
const {
  updateDroneData,
  withinNDZ,
  parseOwnerData,
  distanceFromNest,
  combineDroneWithOwner,
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
  const owner = parseOwnerData(ownerData)
  const droneList = await combineDroneWithOwner(droneData, (arg) => owner)
  droneList.forEach((drone) => {
    expect(drone).toHaveProperty("owner")
  })
})
