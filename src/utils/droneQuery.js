const axios = require("axios")

const getDroneData = async (
  url = "http://assignments.reaktor.com/birdnest/drones"
) => {
  try {
    const response = await axios.get(url)
    return response.data
  } catch (error) {
    console.log(`An error occurred while fetching drone data: ${error}`)
    return {}
  }
}

const getDroneOwnerData = async (serialNumber) => {
  try {
    const response = await axios.get(
      `http://assignments.reaktor.com/birdnest/pilots/${serialNumber}`
    )
    return response.data
  } catch (error) {
    console.log(`An error occurred while fetching pilot data: ${error}`)
    return {}
  }
}

module.exports = { getDroneData, getDroneOwnerData }
