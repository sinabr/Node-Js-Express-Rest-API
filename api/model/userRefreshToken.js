const mongoose = require('mongoose')

var urfSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    userId:{type:mongoose.Schema.Types.ObjectId},
    exp:{type:Number , required:true},
    created_at:Date
})


module.exports = mongoose.model('UserRefreshToken',urfSchema)