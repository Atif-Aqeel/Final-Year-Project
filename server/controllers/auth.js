const asyncHandler = require('express-async-handler')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const Institute = require('../models/Institute')

const { JWT_SECRET } = require('../config/keys')

const signup = async (req, res, next) => {
  const { instituteName, firstName, lastName, email, password } = req.body

  const hash = await bcrypt.hash(password, 12)

  const newInstitute = new Institute({
    name: instituteName
  })
  await newInstitute.save()

  const newUser = new User({
    email,
    password: hash,
    role: 'Admin',
    institute: newInstitute._id.toString(),
    firstName,
    lastName
  })

  await newUser.save()

  newInstitute.admins.push(newUser._id.toString())
  await newInstitute.save()

  const payload = {
    userID: newUser._id.toString(),
    instituteID: newUser.institute.toString(),
    role: newUser.role
  }

  jwt.sign(payload, JWT_SECRET, (error, token) => {
    if (error) throw new Error('internal Server Error')

    res.status(201)
      .json({
        message: 'success',
        token,
        userID: newUser._id.toString(),
        instituteID: newUser.institute.toString(),
        role: newUser.role,
        userName: newUser.firstName + ' ' + newUser.lastName
      })
  })
}

const login = async (req, res, next) => {
  const { email, password } = req.body

  const user = await User.findOne({ email })
  const isEqual = await bcrypt.compare(password, user.password)

  if (!isEqual) {
    const error = new Error('Email or Password does not match.')
    error.statusCode = 401
    return next(error)
  }

  const payload = {
    userID: user._id.toString(),
    instituteID: user.institute.toString(),
    role: user.role
  }

  jwt.sign(payload, JWT_SECRET, (error, token) => {
    if (error) return next(new Error('Internal Server Error'))

    res.status(201)
      .json({
        message: 'success',
        token,
        userID: user._id.toString(),
        instituteID: user._id.toString(),
        role: user.role,
        userName: user.firstName + ' ' + user.lastName

      })
  })
}

const setPassword = async (req, res, next) => {
  const { userID, token, password } = req.body
  const user = await User.findById(userID)

  const isValid = await bcrypt.compare(user.passwordSetToken, token)
  if (!isValid) {
    return next(new Error('Invalid Token!'))
  }

  user.password = await bcrypt.hash(password, 10)
  user.passwordSetToken = null
  await user.save()

  const payload = {
    userID: user._id.toString(),
    instituteID: user.institute.toString(),
    role: user.role
  }
  jwt.sign(payload, JWT_SECRET, (error, token) => {
    if (error) return next(new Error('Internal Server Error'))

    res.status(200)
      .json({
        message: 'success',
        token,
        userID: user._id.toString(),
        instituteID: user._id.toString(),
        role: user.role,
        userName: user.firstName + ' ' + user.lastName
      })
  })
}

module.exports = {
  signup: asyncHandler(signup),
  login: asyncHandler(login),
  setPassword: asyncHandler(setPassword)
}
