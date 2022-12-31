const config = require("./utils/config")
const server = require("./server").default

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})
