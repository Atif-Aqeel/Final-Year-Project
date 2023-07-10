const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser')

const authRoutes = require('./routes/auth')
const classRoutes = require('./routes/instituteClass')
const userRoutes = require('./routes/user')
const subjectRoutes = require('./routes/subject')

const { MONGOURI } = require('./config/keys')
const PORT = process.env.PORT || 3344
const app = express()

app.use(bodyParser.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  next()
})

app.get('/', (req, res, next) => {
  // console.log(getSocket.getIO());
  res.json({ message: 'hello' })
})
app.use(authRoutes)
app.use(classRoutes)
app.use(userRoutes)
app.use('/subject', subjectRoutes)

app.use((error, req, res, next) => {
  console.log(error)
  const status = error.statusCode || 500
  const message = error.message

  if (error.errors) {
    res.status(status).json({
      message,
      error: error.errors
    })
  } else {
    res.status(status).json({
      message
    })
  }

  res.status(500)
})

mongoose.connect(MONGOURI,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, function (error) {
    if (error) {
      console.log('MONGOURI=', MONGOURI)
      console.log(error)
    }
  })

console.log(`connected! at post ${PORT}`)
app.listen(PORT)
