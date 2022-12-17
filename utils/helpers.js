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
    return {
      ...drone,
      owner: parseOwnerData(ownerData),
    }
  })
  return Promise.all(dronePromises)
}

const updateDistance = (drone, oldDroneList) => {
  const oldDrone = oldDroneList.find(
    (d) => d.serialNumber === drone.serialNumber
  )
  if (oldDrone && drone.closestDistance > oldDrone.closestDistance) {
    return oldDrone.closestDistance
  }
  return drone.closestDistance
}

const updateDroneData = (currentDrones, newDrones) => {
  const newDronesToAdd = newDrones.filter((drone) =>
    withinNDZ(drone.closestDistance)
  )
  const newDroneSerials = newDronesToAdd.map((drone) => drone.serialNumber)
  console.log(currentDrones)
  const filteredDrones = currentDrones
    .filter((d) => !newDroneSerials.includes(d.serialNumber))
    .concat(newDronesToAdd)
    .filter((d) => !dataExpired(d.timeStamp))

  return filteredDrones.map((d) => ({
    ...d,
    closestDistance: updateDistance(d, currentDrones),
  }))
}

const distanceFromNest = ([posX, posY]) => {
  const xFromCenter = Math.abs(posX - 250000)
  const yFromCenter = Math.abs(posY - 250000)
  return Math.hypot(xFromCenter, yFromCenter)
}

const withinNDZ = (dist) => {
  return dist <= 100000
}

const dataExpired = (observationTime, timenow = Date.now()) => {
  const diff = timenow - Date.parse(observationTime)
  return diff / 60000 > 10
}

module.exports = {
  parseDroneData,
  updateDroneData,
  withinNDZ,
  parseOwnerData,
  distanceFromNest,
  combineDroneWithOwner,
}
