const { model, Schema } = require('mongoose')

const SubjectTeacherClass = new Schema({
  institute: {
    type: Schema.Types.ObjectId,
    ref: 'Institute'
  },
  subject: {
    type: Schema.Types.ObjectId,
    ref: 'Subject'
  },
  teacher: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  instituteClass: {
    type: Schema.Types.ObjectId,
    ref: 'InstituteClass'
  }
})

module.exports = model('SubjectTeacherClass', SubjectTeacherClass)
