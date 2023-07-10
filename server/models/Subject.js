const { model, Schema } = require('mongoose')
const SubjectTeacherClass = require('./SubjectTeacherClass')

const Subject = new Schema({
  name: {
    type: String,
    required: true
  },
  institute: {
    type: Schema.Types.ObjectId,
    ref: 'Institute'
  }
})

Subject.methods.getMetadata = async function (classFields = '_id', teacherFields = '_id') {
  return await SubjectTeacherClass.find({ subject: this._id.toString() })
    .select('teacher instituteClass')
    .populate('instituteClass', classFields)
    .populate('teacher', teacherFields)
    .lean()
}

module.exports = model('Subject', Subject)
