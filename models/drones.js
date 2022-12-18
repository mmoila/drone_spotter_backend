const mongoose = require("mongoose")

droneSchema = new mongoose.Schema({
  timeStamp: Date,
  serialNumber: String,
  closestDistance: Number,
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "Owner" },
})

const Drone = mongoose.model("Drone", droneSchema)

module.exports = Drone
