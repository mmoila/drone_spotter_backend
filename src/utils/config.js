require("dotenv").config()

let PORT = 3001
let MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
let DATABASE_RESET = process.env.NODE_ENV === "reset-db" ? true : false

module.exports = { PORT, MONGODB_URI, DATABASE_RESET }
