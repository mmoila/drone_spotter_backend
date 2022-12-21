const mongoose = require("mongoose")

const droneSchema = new mongoose.Schema({
  timeStamp: Date,
  serialNumber: String,
  closestDistance: Number,
  owner: { name: String, phoneNumber: String, email: String },
  expireAt: Date,
})

droneSchema.index({ expireAt: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("Drone", droneSchema)
