const mongoose = require('mongoose')

var messageSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    user:{type:mongoose.Schema.Types.ObjectId,ref:'User'},
    type:{type:String,enum:['Inappropriate Content','Illigel Content','Repeated Comment']},
    comment:{type:mongoose.Schema.Types.ObjectId,ref:'Comment',default:null},
    text:{type:String,required:true}
})


module.exports = mongoose.model('Message', messageSchema)