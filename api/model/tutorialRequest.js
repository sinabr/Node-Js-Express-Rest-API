const mongoose = require('mongoose')

var trSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User',default:null},
    type:{type:String,enum:['Request','Suggestion'],default:'Request'},
    response:{type:mongoose.Schema.Types.ObjectId,ref:'TutorialResponse',default:null},
    title:String,
    material:[{url:String,contentType:{type:String,default:null}}],
    desc:{type:String , required:true},
    date:{type:String , required:true},
    createdAt:String,
    checked:{type:Boolean,default:false}
})


module.exports = mongoose.model('TutorialRequest',trSchema)