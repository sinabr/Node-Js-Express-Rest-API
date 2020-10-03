const mongoose = require('mongoose')

var reportSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    tutorial:{type:mongoose.Schema.Types.ObjectId, ref:'Tutorial'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    type:{type:String,enum:['Content','Subject','Quality'],default:'Content'},
    response:{type:mongoose.Schema.Types.ObjectId,ref:'Report',default:null},
    description:{type:String,default:null},
    createdAt:String,
    date:String,
    checked:{type:Boolean,default:false}
})


module.exports = mongoose.model('Report', reportSchema)