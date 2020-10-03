const mongoose = require('mongoose')

var trrSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    request:{type:mongoose.Schema.Types.ObjectId,ref:'TutorialRequest'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    text:{type:String,required:true}
    
})


module.exports = mongoose.model('TutorialReponse',trrSchema)