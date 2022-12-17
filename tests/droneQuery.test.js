const { getDroneData, getDroneOwnerData } = require("../utils/droneQuery")
const { parseDroneData } = require("../utils/helpers")
const parseString = require("xml2js").parseString

describe("When getting owner data", () => {
  test("owner object is returned if data is available", async () => {
    const droneData = await getDroneData()

    parseString(droneData, async (err, result) => {
      const droneList = parseDroneData(result)
      const owner = await getDroneOwnerData(droneList[0].serialNumber)
      expect(owner).toHaveProperty("pilotId")
    })
  })

  test("empty object is returned if data is not available", async () => {
    const owner = await getDroneOwnerData("bogusId")
    expect(owner).toMatchObject({})
  })
})
