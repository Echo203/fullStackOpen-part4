const dotenv = require('dotenv').config()
const http = require('http')
const app = require('./app')
const mongoose = require('mongoose')

const MONGODB_URI = process.env.MONGODB_URI
mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true, useFindAndModify: false, useCreateIndex: true })

const PORT = process.env.PORT || 3000

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})