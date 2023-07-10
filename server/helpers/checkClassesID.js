const mongoose = require('mongoose')
const InstituteClass = require('../models/InstituteClass')

const checkClassesID = async (classes = []) => {
  for (let i = 0; i < classes.length; i++) {
    let cls
    if (mongoose.Types.ObjectId.isValid(classes[i])) { cls = await InstituteClass.findById(classes[i]).select('_id') }
    if (!cls) return false
  }
  return true
}

module.exports = checkClassesID
