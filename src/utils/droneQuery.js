const axios = require("axios")

const getDroneData = async () => {
  const response = await axios.get(
    "http://assignments.reaktor.com/birdnest/drones"
  )
  return response.data
}

const getDroneOwnerData = async (serialNumber) => {
  try {
    const response = await axios.get(
      `http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
    )
    return response.data
  } catch (error) {
    return {}
  }
}

module.exports = { getDroneData, getDroneOwnerData }
