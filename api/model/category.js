const mongoose = require('mongoose')

var categorySchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    title:{type:String, required:true},
    image:{type:String ,default:null},
    parent:{type:mongoose.Schema.Types.ObjectId,ref:'Category'},
    children:{type:[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],default:[]},
    tutorialCount:{type:Number,default:0}
})


module.exports = mongoose.model('Category', categorySchema)