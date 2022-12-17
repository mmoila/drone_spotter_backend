const timeStamp = new Date(Date.now()).toISOString()

const droneData = [
  {
    timeStamp: timeStamp,
    serialNumber: "SN-TAnpkSiEeM",
    closestDistance: 430000,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-NPKLipw-si",
    closestDistance: 990000.12393,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-4T3aQSA1I-",
    closestDistance: 999999.9999,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-QfXINIqMIm",
    closestDistance: 120000,
  },
]

const ownerData = {
  pilotId: "P-FPNez3XqdJ",
  firstName: "Eric",
  lastName: "Kozey",
  phoneNumber: "+210965769601",
  createdDt: "2022-09-23T12:32:01.717Z",
  email: "eric.kozey@example.com",
}

module.exports = { droneData, ownerData }
