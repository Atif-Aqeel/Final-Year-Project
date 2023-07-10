const express = require('express')
const { body, check } = require('express-validator')

const controllers = require('../controllers/subject')
const Subject = require('../models/Subject')
const InstituteClass = require('../models/InstituteClass')
const User = require('../models/User')

const validateExpress = require('../helpers/validateExpress')
const checkSubjectIDs = require('../helpers/checkSubjectIDs')
const isAuth = require('../helpers/isAuth')

const router = express.Router()

router.post('/', isAuth, [
  body('name').notEmpty().isLength({ min: 1 }).withMessage('Name not found.')
], validateExpress, controllers.add)

router.get('/', isAuth, [
  check('subjectID').notEmpty().withMessage('Please enter a valid Subject ID!')
    .custom(value => {
      return Subject.exists({ _id: value })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('Subject not found!')
          else return true
        })
    })
], validateExpress, controllers.get)

router.get('/all', isAuth, controllers.all)

router.get('/classTeacherSubjects', isAuth, [
  check('classID').notEmpty().withMessage('Please enter a valid Class ID!')
    .custom(value => {
      return InstituteClass.exists({ _id: value })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('Class not found!')
          else return true
        })
    }),
  check('teacherID').notEmpty().withMessage('Please enter a valid Teacher ID!')
    .custom(value => {
      return User.exists({ _id: value })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('Teacher not found!')
          else return true
        })
    })
], validateExpress, controllers.classTeacherSubjects)

router.post('/assign', isAuth, [
  check('classID').notEmpty().withMessage('Please enter a valid Class ID!')
    .custom(value => {
      return InstituteClass.exists({ _id: value })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('Class not found!')
          else return true
        })
    }),
  check('teacherID').notEmpty().withMessage('Please enter a valid Teacher ID!')
    .custom(value => {
      return User.exists({ _id: value })
        .then(isPresent => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isPresent) return Promise.reject('Teacher not found!')
          else return true
        })
    }),
  check('subjects').isArray({ min: 1 }).withMessage('Please Select at least One Subject!')
    .custom(value => {
      return checkSubjectIDs(value)
        .then(isValid => {
          // eslint-disable-next-line prefer-promise-reject-errors
          if (!isValid) return Promise.reject('Invalid Subject!')
          else return true
        })
    })
], validateExpress, controllers.assign)

module.exports = router
