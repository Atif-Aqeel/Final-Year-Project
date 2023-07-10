const { model, Schema } = require('mongoose')
const InstituteClass = require('./InstituteClass')

const User = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  institute: {
    type: Schema.Types.ObjectId,
    ref: 'Institute'
  },
  role: {
    type: String,
    enum: ['Student', 'Teacher', 'Admin'],
    default: 'Student'
  },
  firstName: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  gender: {
    type: String,
    enum: ['Male', 'Female'],
    default: 'Male'
  },
  dob: {
    type: Date
  },

  // Student
  class: {
    type: Schema.Types.ObjectId,
    ref: 'InstituteClass'
  },
  rollNo: {
    type: String
  },
  admissionDate: {
    type: String
  },

  // Admin,Teacher
  classes: [
    {
      type: Schema.Types.ObjectId,
      ref: 'InstituteClass'
    }
  ],
  staffID: {
    type: String
  },
  joiningDate: {
    type: String
  },

  // Account Related fields
  passwordSetToken: {
    type: String,
    default: ''
  }
})

User.methods.changeStudentClass = async function (classID) {
  const userID = this._id.toString()
  const prevClassID = this.class.toString()
  if (prevClassID === classID.toString() || this.role !== 'Student') return

  const prevClass = await InstituteClass.findById(prevClassID).select('students')
  const newClass = await InstituteClass.findById(classID).select('students')

  const prevClassStudents = [...prevClass.students.map(ele => ele.toString())]
  const newClassStudents = [...newClass.students.map(ele => ele.toString())]

  const prevClassStudentIndex = prevClassStudents.indexOf(userID)
  if (prevClassStudentIndex >= 0) prevClassStudents.splice(prevClassStudentIndex, 1)
  if (newClassStudents.indexOf(userID) === -1) newClassStudents.push(userID)

  this.class = classID
  prevClass.students = prevClassStudents
  newClass.students = newClassStudents

  await prevClass.save()
  await newClass.save()
  await this.save()
}

module.exports = model('User', User)
