const {model, Schema} = require('mongoose');


const Institute = new Schema({

    name:{
      type:String,
      required:true
    },
    students: [
        {
            type: Schema.Types.ObjectId,
            ref: 'User'
        }
    ],
    admins: [
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
    ],
    classes: [
        {
            type: Schema.Types.ObjectId,
            ref: 'InstituteClass'
        }
    ]


})


module.exports = model('Institute', Institute)