const mongoose = require('mongoose')

var userSchema = new mongoose.Schema({
    _id:mongoose.Schema.Types.ObjectId,
    username:{type:String,required:true},
    fname:{type:String,default:null},
    lname:{type:String,default:null},
    verified:{type:Boolean , default:false},
    email: {
        type:String ,
        required : true ,
        unique : true  ,
        match:/[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/
    } ,    
    password:{type:String , required: true},
    favorites:[{type:mongoose.Schema.Types.ObjectId , ref:'Tutorial' }],
    credit:{type:Number , default:0},
    history:[{type:mongoose.Schema.Types.ObjectId , ref:'Tutorial'}],
    signupDate:{type:String , required:true},
    disabled:{type:Boolean,default:false},
    logged:{type:Boolean,default:false}
})


module.exports = mongoose.model('User',userSchema)