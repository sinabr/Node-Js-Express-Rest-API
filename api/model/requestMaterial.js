
//Not Used => Material Type Changed

const mongoose = require('mongoose')

var reqmatSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    url:{type:String,required:true},
    desc:{type:String,default:null},
    type:{type:String,enum:['text','video','voice','pdf']},
    trusted:{type:Boolean,default:false}
})


module.exports = mongoose.model('RequestMaterial', reqmatSchema)