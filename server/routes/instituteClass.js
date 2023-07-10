const express = require('express')
const { body, check } = require('express-validator')
const asyncHandler = require('express-async-handler')

const classController = require('../controllers/instituteClass')

const InstituteClass = require('../models/InstituteClass')

const validateExpress = require('../helpers/validateExpress')
const isAuth = require('../helpers/isAuth')

const router = express.Router()

router.post('/addClass', isAuth,
  [
    body('className').notEmpty().withMessage('Please enter a valid Class Name.').custom((name, { req }) => {
      return InstituteClass.exists({ name, institute: req.user.instituteID.toString() })
        .then(isPresent => {
          if (isPresent) return Promise.reject('Class Name already exist!')
          else return true
        })
    })
  ],
  validateExpress, asyncHandler(classController.addClass))

router.get('/getClasses', isAuth, asyncHandler(classController.getClasses))

router.get('/getClassesData', isAuth, asyncHandler(classController.getClassesData))

router.get('/getClassData', isAuth, [
  check('classID').notEmpty().withMessage('Please select a valid Class.').custom((classID, { req }) => {
    return InstituteClass.exists({ _id: classID, institute: req.user.instituteID.toString() })
      .then(isPresent => {
        if (!isPresent) return Promise.reject('Class Not Found!')
        else return true
      })
  })
],
validateExpress, asyncHandler(classController.getClassData))

module.exports = router
