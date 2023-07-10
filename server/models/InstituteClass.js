const { model, Schema } = require('mongoose')

const InstituteClass = new Schema({
  name: {
    type: String,
    required: true
  },
  institute: {
    type: Schema.Types.ObjectId,
    ref: 'Institute'
  },
  students: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  teachers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ]
})

InstituteClass.methods.addTeacher = async function (teacherId) {
  const teachers = [...this.teachers.map(ele => ele.toString())]
  if (teachers.indexOf(teacherId) === -1) {
    teachers.push(teacherId)
  }
  this.teachers = teachers
  await this.save()
}

InstituteClass.methods.removeTeacher = async function (teacherId) {
  const teachers = [...this.teachers.map(ele => ele.toString())]
  const index = teachers.indexOf(teacherId)
  if (index >= 0) {
    teachers.splice(index, 1)
  }
  this.teachers = teachers
  await this.save()
}

InstituteClass.methods.removeStudent = async function (teacherId) {
  const students = [...this.students.map(ele => ele.toString())]
  const index = students.indexOf(teacherId)
  if (index >= 0) {
    students.splice(index, 1)
  }
  this.students = students
  await this.save()
}

module.exports = model('InstituteClass', InstituteClass)
