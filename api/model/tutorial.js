const mongoose = require('mongoose')

var tutorialSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    references:[String],
    image:{type:String,default:null},
    category:{type:mongoose.Schema.Types.ObjectId,ref:'Category',required:true},
    title:{type:String,required:true},
    tags:[String],
    // admin:adminId,
    material:{type:String,required:true}, 
    description:{type:String,maxlength:2000},
    price:{type:Number,defualt:0},
    language:{type:String,enum:['En','Fa'],default:'En'},
    viewCount:{type:Number,default:0},
    rateCount:{type:Number,default:0},
    likeCount:{type:Number,default:0},
    avgRate:{type:Number,default:2.5},
    commentCount:{type:Number,default:0},
    createdAt:String,
    date:String, 
    instructors:[String],
    publisher:String
})


module.exports = mongoose.model('Tutorial',tutorialSchema)