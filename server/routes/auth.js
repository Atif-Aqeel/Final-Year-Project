const express = require('express')
const { body } = require('express-validator')

const User = require('../models/User')
const authController = require('../controllers/auth')
const validateExpress = require('../helpers/validateExpress')

const router = express.Router()

router.post('/signup',
  [
    body('email').isEmail().withMessage('Please enter a valid email.').custom(email => {
      return User.exists({ email })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (isPresent) return Promise.reject('Email already exist!')
          else return true
        })
    }).normalizeEmail(),
    body('instituteName').notEmpty().withMessage('Institute Name must have 1 character.'),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must have 6 character.'),
    body('firstName').notEmpty().withMessage('First Name must have 1 character.'),
    body('lastName').notEmpty().withMessage('Last Name must have 1 character.')
  ]
  , validateExpress, authController.signup)

router.post('/login',
  [
    body('email').isEmail().withMessage('Please enter a valid email.').custom(email => {
      return User.exists({ email })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) { return Promise.reject('Email not found.') } else { return true }
        })
    }).normalizeEmail(),
    body('password').notEmpty().isLength({ min: 6 }).withMessage('Password must have 6 character.')
  ], validateExpress, authController.login)

router.post('/set-password',
  [
    body('userID').custom(userID => {
      return User.exists({ _id: userID })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('User not found!')
          return true
        })
    }),
    body('password').notEmpty().isLength({ min: 5 }).withMessage('Password too short.'),
    body('token').notEmpty().withMessage('Token not found.')],
  validateExpress, authController.setPassword)

module.exports = router
