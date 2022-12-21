const { getDroneData, getDroneOwnerData } = require("../utils/droneQuery")
const { xml2json } = require("xml-js")

describe("When getting owner data", () => {
  test("owner object is returned if data is available", async () => {
    const droneData = await getDroneData()

    const parsedData = JSON.parse(xml2json(droneData, { compact: true }))
    const owner = await getDroneOwnerData(
      parsedData.report.capture.drone[0].serialNumber._text
    )
    expect(owner).toHaveProperty("pilotId")
  })

  test("empty object is returned if data is not available", async () => {
    const owner = await getDroneOwnerData("bogusId")
    expect(owner).toMatchObject({})
  })
})
