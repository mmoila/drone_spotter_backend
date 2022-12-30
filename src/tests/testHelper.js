const timeStamp = new Date(Date.now()).toISOString()
const dateObject = new Date(Date.parse(timeStamp))
const expireDate = dateObject.setMinutes(dateObject.getMinutes() + 10)

const droneData = [
  {
    timeStamp: timeStamp,
    serialNumber: "SN-TAnpkSiEeM",
    closestDistance: 43000,
    expireAt: expireDate,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-NPKLipw-si",
    closestDistance: 99000.12393,
    expireAt: expireDate,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-4T3aQSA1I-",
    closestDistance: 99999.9999,
    expireAt: expireDate,
  },
  {
    timeStamp: timeStamp,
    serialNumber: "SN-QfXINIqMIm",
    closestDistance: 120000,
    expireAt: expireDate,
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

const rawDroneData = `<report>
<deviceInformation deviceId="GUARDB1RD">
<listenRange>500000</listenRange>
<deviceStarted>2022-12-18T16:41:55.751Z</deviceStarted>
<uptimeSeconds>68857</uptimeSeconds>
<updateIntervalMs>2000</updateIntervalMs>
</deviceInformation>
<capture snapshotTimestamp="2022-12-19T11:49:32.885Z">
<drone>
<serialNumber>SN-kC7a5aYhQo</serialNumber>
<model>Falcon</model>
<manufacturer>MegaBuzzer Corp</manufacturer>
<mac>9d:b5:c9:c3:1f:5d</mac>
<ipv4>112.194.78.83</ipv4>
<ipv6>9da5:f1c7:ad47:644b:4b3e:3d10:b98d:f365</ipv6>
<firmware>0.1.8</firmware>
<positionY>94790.83966764629</positionY>
<positionX>124172.52052909134</positionX>
<altitude>4412.488294905883</altitude>
</drone>
<drone>
<serialNumber>SN-UQcmQChlGv</serialNumber>
<model>Mosquito</model>
<manufacturer>MegaBuzzer Corp</manufacturer>
<mac>89:bc:65:56:85:79</mac>
<ipv4>213.208.161.93</ipv4>
<ipv6>0cd2:3838:d68c:4831:92df:5a5e:0543:455a</ipv6>
<firmware>3.7.0</firmware>
<positionY>564.9796111614431</positionY>
<positionX>50721.679122328635</positionX>
<altitude>4016.1263855729426</altitude>
</drone>
<drone>
<serialNumber>SN-N4b2SVncka</serialNumber>
<model>HRP-DRP 1 Pro</model>
<manufacturer>ProDröne Ltd</manufacturer>
<mac>0b:52:7f:ae:b7:db</mac>
<ipv4>72.221.229.24</ipv4>
<ipv6>84b3:8dc6:526e:711c:0536:868b:e4d5:308a</ipv6>
<firmware>4.6.5</firmware>
<positionY>297974.8314605072</positionY>
<positionX>384026.64721477457</positionX>
<altitude>4041.051197437674</altitude>
</drone>
<drone>
<serialNumber>SN-Y3r08kF4eQ</serialNumber>
<model>Altitude X</model>
<manufacturer>DroneGoat Inc</manufacturer>
<mac>fa:d0:39:93:00:8c</mac>
<ipv4>219.196.35.162</ipv4>
<ipv6>c00c:1648:d7be:172e:69a7:0981:564b:6cfc</ipv6>
<firmware>8.3.7</firmware>
<positionY>461652.2824209232</positionY>
<positionX>246506.22740542007</positionX>
<altitude>4210.216907526602</altitude>
</drone>
</capture>
</report>`

module.exports = { droneData, ownerData, rawDroneData }
