const mongoose = require('mongoose');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const User = require('../model/user')
const Admin = require('../model/admin')
const Category = require('../model/category')


exports.addAdmin = (req,res,next)=>{

    // var nickname = "sinbr"
    // var fname = "sina"
    // var lname = "barazandeh"
    // var email = "sinabr@sehub.ir"
    // var password = "admin_sina"
    
    var body = req.body
    var nickname = body.nickname
    var fname = body.fname
    var lname = body.lname
    var email = body.email
    var password = body.password

    bcrypt.hash(password , 10 , (err , hash)=>{
        console.log(hash)
        var admin = new Admin({
            _id:mongoose.Types.ObjectId(),
            nickname:nickname,
            lname:lname,
            fname:fname,
            email:email,
            password:hash
        })


        admin.save()
        .then(created=>{
            res.status(201).end()
        }).catch(err=>{console.log(err);res.status(500).send(err)})
    })


    
}


exports.sampleCategories = (req,res,next)=>{

    var catg01 = new Category({
        _id:mongoose.Types.ObjectId(),
        title:'Design'
    })

    catg01.save()
    .then(c1=>{
        var catg02 = new Category({
            _id:mongoose.Types.ObjectId(),
            title:'Architecture',
            parent:c1._id
        })

        catg02.save()
        .then(saved=>{
            Category.updateOne({_id:c1._id},{$push:{children:saved._id}}).exec()
            .then(updated=>{
                res.status(200).send("added")
            })
        })


        var catg03 = new Category({
            _id:mongoose.Types.ObjectId(),
            title:'Interface',
            parent:c1._id
        })


        catg03.save()
        .then(saved=>{
            Category.updateOne({_id:c1._id},{$push:{children:saved._id}}).exec()
            .then(updated=>{
                res.status(200).send("added")
            })
        })

        var catg04 = new Category({
            _id:mongoose.Types.ObjectId(),
            title:'Design Quality Analysis',
            parent:c1._id
        })


        catg04.save()
        .then(saved=>{
            Category.updateOne({_id:c1._id},{$push:{children:saved._id}}).exec()
            .then(updated=>{
                res.status(200).send("added")
            })
        })
    })

    // catg06 = new Category({
    //     _id:mongoose.Types.ObjectId(),
    //     title:'Construction'
    // })

    // catg06.save()
    // .then(c6=>{

    // })


}