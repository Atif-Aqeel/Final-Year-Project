const {model, Schema} = require('mongoose');


const Attendance = new Schema({

    date: {
        type: Date,
        required: true
    },
    isPresent:{
        type:Boolean,
        default:false
    },
    student: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    attendanceClass: {
        type: Schema.Types.ObjectId,
        ref: 'InstituteClass'
    },
    // institute: {
    //     type: Schema.Types.ObjectId,
    //     ref: 'InstituteClass'
    // }

})


module.exports = model('Attendance', Attendance)