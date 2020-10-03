const mongoose = require('mongoose')

var resourceSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String, required:true},
    source:{type:String,required:true},
    url:{type:String,required:true},
    trustLevel:{type:Number,min:5,max:10,required:true},
    desc:{type:String,default:null}
})

module.exports = mongoose.model('Resource', resourceSchema)