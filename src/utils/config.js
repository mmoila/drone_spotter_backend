require("dotenv").config()

const PORT = 3001
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI
const DATABASE_RESET = process.env.NODE_ENV === "reset-db"

module.exports = { PORT, MONGODB_URI, DATABASE_RESET }
