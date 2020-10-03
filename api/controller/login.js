const mongoose = require('mongoose');
const User = require('../model/user')
const Admin = require('../model/admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')


exports.login = (req ,res , next)=>{

    var body = req.body
    if(body.email && body.password){
        body.email = body.email.toLowerCase()
        Admin.findOne({email:body.email}).lean().exec()
        .then(admin=>{
            if(admin){
                bcrypt.compare(req.body.password , admin.password , (err , result)=>{
                    if(err){
                        return res.status(401).json({
                            message:"Authentication Failed"
                        })
                    } 
                    if(result){
    
                        console.log(process.env.JWT_KEY)
                        const token = jwt.sign({
                            ref:"admin",
                            adminId:admin._id,
                        }, 
                        process.env.JWT_KEY,
                        { 
                            expiresIn:'8h'
                        });
                        
                        Admin.updateOne({_id:admin._id},{$set:{logged:true}}).exec()
                        .then(logged=>{
                            res.status(200).json({   
                                data:admin,                 
                                token:token,    
                                admin:true,
                                message:"Authentication successful"                    
                            })
                        }).catch(err=>{
                            console.log(err)
                            res.status(500).send(err)
                        })
                    
                    }else{
                        return res.status(401).json({
                            message:"Authentication Failed"
                        })
                    }

                })
            }else{
                User.findOne({email:body.email}).lean().exec()
                .then(user=>{
                    if(user){
                        bcrypt.compare(req.body.password , user.password , (err , result)=>{
                            if(err){
                                return res.status(401).json({
                                    message:"Authentication Failed"
                                })
                            } 
                            if(result){
            
                                console.log(process.env.JWT_KEY)
                                const token = jwt.sign({
                                    ref:"user",
                                    userId:user._id,
                                }, 
                                process.env.JWT_KEY,
                                { 
                                    expiresIn:'8h'
                                });
                                


                                User.updateOne({_id:user._id},{$set:{logged:true}}).exec()
                                .then(logged=>{
                                    res.status(200).json({   
                                        data:user,                 
                                        token:token,    
                                        admin:false,
                                        message:"Authentication successful"                    
                                    })
                                }).catch(err=>{
                                    console.log(err)
                                    res.status(500).send(err)
                                })
                            
                            }
                            return res.status(401).json({
                                message:"Authentication Failed"
                            })
                        })
                    }else{
                        res.status(401).json({
                            message:"Authentication Failed"
                        })
                    }
                })
            }
        })
    }else{

        res.status(400).json({
            type:"Bad Request",
            message:"Email or Password not provided"
        })

    }
    

}

exports.logout = (req,res,next)=>{

    if(req.userData){
        User.updateOne({_id:req.userData.userId},{$set:{logged:false}}).exec()
        .then(loggedout=>{
            res.status(200).end()
        }).catch(err=>{
            console.log(err)
            res.status(500).send(err)
        })
    }else{
        if(req.adminData){
            Admin.updateOne({_id:req.adminData.adminId},{$set:{logged:false}}).exec()
            .then(loggedout=>{
                res.status(200).end()
            }).catch(err=>{
                console.log(err)
                res.status(500).send(err)
            })
        }else{
            res.status(401).json({
                type:'Auth',
                message:"Authentication Failed"
            })
        }
    }
    
}