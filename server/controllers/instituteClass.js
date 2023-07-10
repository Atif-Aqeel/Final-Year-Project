const mongoose = require('mongoose')
const asyncHandler = require('express-async-handler')

const InstituteClass = require('../models/InstituteClass')

const addClass = async (req, res, next) => {
  const { className } = req.body

  const newClass = new InstituteClass({
    name: className,
    institute: req.user.instituteID
    // 'teachers': [req.user.userID]
  })

  await newClass.save()

  res.status(201)
    .json({
      message: 'success',
      classID: newClass._id.toString()
    })
}

const getClasses = async (req, res, next) => {
  const classes = await InstituteClass.find({
    institute: req.user.instituteID
  }).select('name').lean()

  res.status(200)
    .json({
      message: 'success',
      classes
    })
}

const getClassesData = async (req, res, next) => {
  // let classes = InstituteClass.find({
  //     'institute': req.user.instituteID,
  // }).select('name students teachers')

  const classes = await InstituteClass.aggregate()
    .match({ institute: mongoose.Types.ObjectId(req.user.instituteID) })
    .project({ name: 1, students: { $size: '$students' }, teachers: { $size: '$teachers' } })

  res.status(200)
    .json({
      message: 'success',
      classes
    })
}

const getClassData = async (req, res, next) => {
  const { classID } = req.query

  const classData = await InstituteClass.findById(classID)
    .select('name students teachers')
    .populate('students', 'firstName lastName rollNo admissionDate', 'User')
    .populate('teachers', 'firstName lastName staffID joiningDate', 'User')

  res.status(200)
    .json({
      message: 'success',
      classData
    })
}

module.exports = {
  addClass: asyncHandler(addClass),
  getClasses: asyncHandler(getClasses),
  getClassesData: asyncHandler(getClassesData),
  getClassData: asyncHandler(getClassData)
}
