const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')
const config = require('./utils/config')

mongoose.connect(config.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const server = http.createServer(app)

server.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`)
})