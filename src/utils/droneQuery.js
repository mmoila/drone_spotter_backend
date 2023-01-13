const axios = require("axios")

const getDroneData = async (
  url = "http://assignments.reaktor.com/birdnest/drones"
) => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    return null
  }
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
