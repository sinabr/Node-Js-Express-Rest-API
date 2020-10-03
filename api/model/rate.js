const mongoose = require('mongoose')

var rateSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    tutorial:{type:mongoose.Schema.Types.ObjectId, ref:'Tutorial'},
    user:{type:mongoose.Schema.Types.ObjectId,ref:'user'},
    rate:{type:Number,min:1,max:5}
})


module.exports = mongoose.model('Rate', rateSchema)