const Subject = require('../models/Subject')
const SubjectTeacherClass = require('../models/SubjectTeacherClass')
const asyncHandler = require('express-async-handler')

const add = async (req, res) => {
  const {
    name
  } = req.body

  const sub = new Subject({ name, institute: req.user.instituteID })
  await sub.save()

  res.status(201)
    .json({
      message: 'success'
    })
}

const get = async (req, res) => {
  const {
    subjectID
  } = req.query

  const subject = await Subject.findById(subjectID)
    .select('name')

  const data = await subject.getMetadata('name teachers students', 'firstName lastName staffID joiningDate')
  const subjectData = transformSubjectData(data)

  res.status(200)
    .json({
      message: 'success',
      subject,
      data: subjectData
    })
}

const all = async (req, res) => {
  const subjects = await Subject.find({ institute: req.user.instituteID })
    .select('name').exec()

  const subjectsData = []
  for (let i = 0; i < subjects.length; i++) {
    const sub = subjects[i]
    let data = await sub.getMetadata('_id', '_id')
    data = transformSubjectData(data)

    subjectsData.push({
      classes: data.classes,
      teachers: data.teachers,
      name: sub.name,
      _id: sub._id
    })
  }

  res.status(200)
    .json({
      message: 'success',
      subjects: subjectsData
    })
}

const classTeacherSubjects = async (req, res) => {
  const { classID, teacherID } = req.query

  const subjects = await SubjectTeacherClass.find({ institute: req.user.instituteID, teacher: teacherID, instituteClass: classID })
    .select('subject')
    .lean()

  res.status(200)
    .json({
      message: 'success', 
      subjects
    })
}

const assign = async (req, res) => {
  const { classID, teacherID, subjects } = req.body
  // Remove all subject of the teacher in the respective class
  await SubjectTeacherClass.remove({ institute: req.user.instituteID, teacher: teacherID, instituteClass: classID })
  // Add new Subjects
  const teacherSubjects = subjects.map(sub => ({ institute: req.user.instituteID, subject: sub, teacher: teacherID, instituteClass: classID }))
  const result = await SubjectTeacherClass.insertMany(teacherSubjects)

  res.status(201)
    .json({
      message: 'success',
      result
    })
}

module.exports = {
  add: asyncHandler(add),
  get: asyncHandler(get),
  all: asyncHandler(all),
  classTeacherSubjects: asyncHandler(classTeacherSubjects),
  assign: asyncHandler(assign)
}

const transformSubjectData = (data) => {
  const classes = new Set()
  const teachers = new Set()
  data.forEach((subjectItem) => {
    teachers.add(subjectItem.teacher)
    classes.add(subjectItem.instituteClass)
  })

  return ({
    classes: [...classes],
    teachers: [...teachers]
  })
}
