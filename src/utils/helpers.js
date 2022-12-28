const { getDroneOwnerData, getDroneData } = require("./droneQuery")
const { xml2json } = require("xml-js")
const Drone = require("../models/drones")
const EventEmitter = require("events")
const emitter = new EventEmitter()

const parseDroneData = (xmlData) => {
  const jsonData = JSON.parse(xml2json(xmlData, { compact: true }))
  const timeStamp = jsonData.report.capture._attributes.snapshotTimestamp
  const drones = jsonData.report.capture.drone

  const parsedData = drones.map((drone) => {
    const dateObject = new Date(Date.parse(timeStamp))
    const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)

    return {
      timeStamp: timeStamp,
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

const getIntruderDrones = (data) => {
  return parseDroneData(data).filter((drone) =>
    withinNDZ(drone.closestDistance)
  )
}

const updateDroneData = async () => {
  let droneData = await getDroneData()
  let droneList = await combineDronesWithOwners(getIntruderDrones(droneData))
  await updateDroneDatabase(droneList)

  emitter.emit("DronesUpdated")
}

const updateDroneDatabase = async (droneList) => {
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
}

const parseOwnerData = (data) => {
  return {
    name:
      data.firstName && data.lastName
        ? `${data.firstName} ${data.lastName}`
        : null,
    phoneNumber: data.phoneNumber ? data.phoneNumber : null,
    email: data.email ? data.email : null,
  }
}

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

const distanceFromNest = ([posX, posY]) => {
  const xFromCenter = Math.abs(posX - 250000)
  const yFromCenter = Math.abs(posY - 250000)
  return Math.hypot(xFromCenter, yFromCenter)
}

const withinNDZ = (dist) => {
  return dist <= 100000
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
  updateDroneData,
  emitter,
  resetDatabase,
}
