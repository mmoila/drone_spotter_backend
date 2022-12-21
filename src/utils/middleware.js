const errorHandler = (error, req, res, next) => {
  console.log(`An error occurred: ${error}`)

  next(error)
}

module.exports = { errorHandler }
