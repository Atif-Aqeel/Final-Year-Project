const mongoose = require('mongoose')
const Subject = require('../models/Subject')

const checkSubjectIDs = async (subjects = []) => {
  for (let i = 0; i < subjects.length; i++) {
    let cls
    if (mongoose.Types.ObjectId.isValid(subjects[i])) { cls = await Subject.findById(subjects[i]).select('_id') }
    if (!cls) return false
  }
  return true
}

module.exports = checkSubjectIDs
