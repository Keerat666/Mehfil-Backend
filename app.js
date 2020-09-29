const express = require('express')
const app = express()
const fs = require('fs')
const path = require('path')
const morgan = require('morgan')
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
var cors = require('cors')

// Route Files
const userRoutes = require('./api/routes/user')
const postRoutes = require('./api/routes/post')
const profileRoutes = require('./api/routes/profile')
const verificationRoutes = require('./api/routes/verification')

// Mongoose Connection
mongoose
  .connect(
    `mongodb+srv://MehfilPro:blindingLights@cluster0.fmsec.mongodb.net/Mehfil?retryWrites=true&w=majority`,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false
    }
  )
  .catch(error => console.error(error))

var accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), {
  flags: 'a'
})

// Enablish CORS preflight for all endpoints
app.use(cors())
// Morgan for logging all requests
app.use(morgan('combined', { stream: accessLogStream }))

// Set static files and folders
app.use('/uploads', express.static('uploads'))

// Body parser middleware for making request body easily readable
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// CORS Options
// app.use((req, res, next) => {
//   res.header('Access-Control-Allow-Origin', '*')
//   res.header(
//     'Access-Control-Allow-Header',
//     'Origin, X-Requested-With, Content-Type, Accept, Authorization'
//   )
//   if (req.method === 'OPTIONS') {
//     res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET')
//     return res.status(200).json({})
//   }
//   next()
// })

// Routes
app.get('/', (req, res, next) =>
  res
    .status(200)
    .send(
      "Hello there! You have come this far but you won't be able to proceed further" +
        req.body.name.firstName
    )
)
app.use('/user', userRoutes)
app.use('/post', postRoutes)
app.use('/profile', profileRoutes)
app.use('/verification', verificationRoutes)

// Response for unavailable routes
app.use((req, res, next) => {
  const error = new Error('Not found')
  error.status = 404
  next(error)
})
app.use((error, req, res, next) => {
  res.status(error.status || 500)
  res.json({
    error: {
      message: error.message
    }
  })
})

module.exports = app
