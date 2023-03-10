const { xml2json } = require("xml-js")
const { getDroneOwnerData, getDroneData } = require("./droneQuery")
const Drone = require("../models/drones")

const distanceFromNest = ([posX, posY]) => {
  const xFromCenter = Math.abs(posX - 250000)
  const yFromCenter = Math.abs(posY - 250000)
  return Math.hypot(xFromCenter, yFromCenter)
}

const parseDroneData = (xmlData) => {
  const jsonData = JSON.parse(xml2json(xmlData, { compact: true }))
  const timeStamp = jsonData.report.capture._attributes.snapshotTimestamp
  const drones = jsonData.report.capture.drone

  const parsedData = drones.map((drone) => {
    const dateObject = new Date(Date.parse(timeStamp))
    const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)

    return {
      timeStamp,
      serialNumber: drone.serialNumber._text,
      closestDistance: distanceFromNest([
        drone.positionX._text,
        drone.positionY._text,
      ]),
      position: [
        parseFloat(drone.positionX._text),
        parseFloat(drone.positionY._text),
      ],
      expireAt: expireDate,
    }
  })
  return parsedData
}

const parseOwnerData = (data) => ({
  name:
    data.firstName && data.lastName
      ? `${data.firstName} ${data.lastName}`
      : null,
  phoneNumber: data.phoneNumber ? data.phoneNumber : null,
  email: data.email ? data.email : null,
})

const withinNDZ = (dist) => dist <= 100000

const combineDronesWithOwners = (droneList, getData = getDroneOwnerData) => {
  const dronePromises = droneList.map(async (drone) => {
    const ownerData = await getData(drone.serialNumber)
    return {
      ...drone,
      owner: parseOwnerData(ownerData),
    }
  })

  return Promise.all(dronePromises)
}

const updateDroneDatabase = async (droneList) => {
  const dronePromises = droneList.map(async (drone) => {
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
  return Promise.all(dronePromises)
}

const getIntruderDrones = (data, dataParser = parseDroneData) =>
  dataParser(data).filter((drone) => withinNDZ(drone.closestDistance))

const updateDroneData = async () => {
  const droneData = await getDroneData()
  if (Object.keys(droneData).length !== 0) {
    const droneList = await combineDronesWithOwners(
      getIntruderDrones(droneData)
    )
    await updateDroneDatabase(droneList)
  }
}

const resetDatabase = async () => {
  await Drone.deleteMany({})
}

module.exports = {
  parseDroneData,
  withinNDZ,
  parseOwnerData,
  distanceFromNest,
  combineDronesWithOwners,
  getIntruderDrones,
  updateDroneDatabase,
  updateDroneData,
  resetDatabase,
}
