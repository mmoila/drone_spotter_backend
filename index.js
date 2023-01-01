const config = require("./src/utils/config")
const server = require("./src/server")

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
