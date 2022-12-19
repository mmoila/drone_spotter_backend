const { getDroneOwnerData } = require("./droneQuery")

const parseDroneData = (data) => {
  const timeStamp = data.report.capture[0]["$"].snapshotTimestamp
  const drones = data.report.capture[0].drone

  const parsedData = drones.map((drone) => {
    return {
      timeStamp: timeStamp,
      serialNumber: drone.serialNumber[0],
      closestDistance: distanceFromNest([
        drone.positionX[0],
        drone.positionY[0],
      ]),
    }
  })
  return parsedData
}

const getIntruderDrones = (data) => {
  return parseDroneData(data).filter((drone) =>
    withinNDZ(drone.closestDistance)
  )
}

const parseOwnerData = (data) => {
  return {
    name:
      data.firstName || data.lastName
        ? `${data.firstName} ${data.lastName}`
        : null,
    phoneNumber: data.phoneNumber ? data.phoneNumber : null,
    email: data.email ? data.email : null,
  }
}

const combineDroneWithOwner = (droneList, getData = getDroneOwnerData) => {
  const dronePromises = droneList.map(async (drone) => {
    const ownerData = await getData(drone.serialNumber)
    const dateObject = new Date(Date.parse(drone.timeStamp))
    const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)
    return {
      ...drone,
      owner: parseOwnerData(ownerData),
      expireAt: expireDate,
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

module.exports = {
  parseDroneData,
  withinNDZ,
  parseOwnerData,
  distanceFromNest,
  combineDroneWithOwner,
  getIntruderDrones,
}
