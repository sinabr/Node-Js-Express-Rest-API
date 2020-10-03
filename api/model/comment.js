const mongoose = require('mongoose')

var commentSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    tutorial:{type:mongoose.Schema.Types.ObjectId, ref:'Tutorial'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    text:{type:String,default:null},
    repliedTo:{type:mongoose.Schema.Types.ObjectId, ref:'Comment',default:null},
    date:String,
    createdAt:String
})


module.exports = mongoose.model('Comment', commentSchema)