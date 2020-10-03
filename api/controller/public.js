const mongoose = require('mongoose');
const Address = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const TutorialRequest = require('../model/tutorialRequest')
const TutorialResponse = require('../model/tutorialResponse')
const RequestMaterial = require('../model/tutorialResponse')
// const Message = require('../model/')
const Category = require('../model/category')
const Tutorial = require('../model/tutorial')
const User = require('../model/user')
const Comment = require('../model/comment')


function set(tutorial,indexNumber){
    return new Promise((resolve , reject)=>{
        var index = indexNumber + 1
        var title = tutorial.category.parent.title + ' ' + tutorial.category.title + ' ' + index
        var url = 'http://87.236.213.229/public/tutorial/get/' + tutorial._id
        resolve({title:title,url:url})
    })

}

async function setTutorials(array){
    return new Promise((resolve, reject)=>{
        var promises = new Array()
        for(let c = 0;c<array.length;c++){
            promises.push(
                set(array[c],c)
            )
        }

        Promise.all(promises)
        .then(results=>{
            resolve(results)
        }).catch(err=>{reject(err)})
    })
}


exports.allCategories = (req,res,next)=>{

    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)

    var skip = page*limit

    Category.find({children:{$ne:[]}}).skip(skip).limit(limit)
    .populate('children')
    .lean().exec()
    .then(categories=>{
        res.status(200).send(categories)
    }).catch(err=>{console.log(err)
        res.status(500).json({
            type:'Internal Error',
            message:err
        })
    })



}


exports.categoryTutorials = (req,res,next)=>{

    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)

    var skip = page*limit

    categoryId = req.params.categoryId
    Category.findById(categoryId).skip(skip).limit(limit).lean().exec()
    .then(category=>{
        Category.find({parents:categoryId}).lean().exec()
        .then(catgs=>{
            Tutorial.find({$or:[{category:categoryId},{categoryId:{$in:catgs}}]}).sort({createdAt:-1})
            .populate('category')
            .lean().exec()
            .then(tutorials=>{
                res.status(200).send(tutorials)
            }).catch(err=>{console.log(err)
                res.status(500).send(err)
            })
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }).catch(err=>{console.log(err)
        res.status(500).json({
            type:'Internal Error',
            message:err  
        })
    })

}

exports.getAllTutorials = (req,res,next)=>{

    Tutorial.find()
    .lean()
    .populate({path:'category',populate:{path:'parent'}})
    .exec()
    .then(tutorials=>{
        setTutorials(tutorials)
        .then(sets=>{
            res.status(200).send(sets)
        }).catch(err=>{console.log(err);res.status(500).send(err)})
    }).catch(err=>{console.log(err);res.status(500).send(err)})
}

exports.getTutorial = (req,res,next)=>{

    Tutorial.findByIdAndUpdate(req.params.tutorialId,{$inc:{viewCount:1}})
    .populate({path:'category',populate:{path:'parent'}})
    .lean().exec()
    .then(tutorial=>{
        
        if(req.userData){
            User.findOne({_id:req.userData.userId,favorites:tutorial._id}).lean().exec()
            .then(user=>{
                if(user){
                    tutorial.liked = true
                    res.status(200).send({tutorial})
                }else{
                    tutorial.liked = false
                    res.status(200).send(tutorial)
                }
            }).catch(err=>{console.log(err);res.status(500).send(err)})
        }else{
            // not liked for not logged in
            tutorial.liked = false
            res.status(200).send(tutorial)
        }
    }).catch(err=>{console.log(err)
        res.status(500).json({
            type:'Internal Error',
            message:err
        })    
    })

}


exports.search = (req,res,next)=>{

    
    var page = parseInt(req.body.page)
    var limit = parseInt(req.body.limit)

    var city = req.body.city
    var skip = page * limit

    var text = req.body.text
    text = text.trim()

    var s = '.*'


    var texts = []
    if(text.includes(' ')){
        texts = text.split(' ') 
    }else{
        texts.push(text)
    }
    var c = 0
    while(c < texts.length){
        t = texts[c]
        if(t.length > 1){

            var chars = t.slice('')
            for(var i of chars){
                s = s + i + "\\s*"
            }
            
            console.log("Here")
            s = s + '.*'
        }
        c++
    }
    console.log(s)
    
    // var regex = new RegExp(s , 'i')
    
    // var sregex = regex.toString()
    // console.log(sregex)
    sregex = s
    console.log(sregex)
    var regex = new RegExp(sregex ,'i')

    Category.find({title:regex}).distinct('_id').exec()
    .then(categories=>{
        Tutorial.find({$or:[{category:{$in:categories}},{title:regex},{tags:regex},
            {publisher:regex},{instructor:regex},{references:regex}]}).skip(skip).limit(limit).lean().exec()
            .then(tutorials=>{
                res.status(200).send(tutorials)    
            }).catch(err=>{console.log(err);res.status(500).send(err)})
    }).catch(err=>{console.log(err)
        res.status(500).json({
            type:'Internal Error',
            message:err
        })
    })


}

exports.tutorialComments = (req,res,next)=>{

    var page = parseInt(req.query.page)
    var limit = parseInt(req.query.limit)
    var skip = page * limit

    Comment.find({tutorial:req.params.tutorialId}).sort({createdAt:1}).skip(skip).limit(limit)
    .lean()
    .populate('user')
    .exec()
    .then(comments=>{

        res.status(200).send(comments)

    }).catch(err=>{console.log(err);res.status(500).send(err)})


}