const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    nickname:{type:String, required:true},
    fname:{type:String,required:true},
    lname:{type:String,required:true},
    email: {
        type:String ,
        required : true ,
        unique : true  ,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    } ,    
    password:{type:String , required: true},
    categories:[{type:mongoose.Schema.Types.ObjectId,ref:'Category'}],
    logged:{type:Boolean,default:false},
    head:{type:Boolean, default:true}
    //null means all categories
})


module.exports = mongoose.model('Admin',userSchema)