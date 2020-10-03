const mongoose = require('mongoose');
const Address = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const moment = require('jalali-moment')
const axios = require('axios')

const User = require('../model/user')
const TutorialRequest = require('../model/tutorialRequest')
const TutorialResponse = require('../model/tutorialResponse')
const RequestMaterial = require('../model/tutorialResponse')
const Comment = require('../model/comment')
const Report = require('../model/report')
const Tutorial = require('../model/tutorial')
const Rate = require('../model/rate')
// const Message = require('../model/message.js')


function getType(url){
    return new Promise((resolve , reject)=>{
  
        axios.get(url)
            .then(function (response) {
            // handle success
            var type = response.headers['content-type']
            var t = type.split('/')
            console.log(t)
            var type = null
            if(t[0] == 'application'){
                type = t[1]
            }else{
                if(t[1].includes(';')){
                r = t[1].split(';')
                type = r[0]
                }else{
                if(t[0] == 'video'){
                    type = 'video'
                }else{
                    type = 'webpage'
                }
                }
            }
            resolve({url:url,type:type})
        
            })
            .catch(function (error) {
            // handle error
            console.log(error);
            resolve({url:url,type:'UNCLEAR'})
            })
            .finally(function () {
            // always executed
            });
        
        
            })
  
  }
  
  async function getTypes(array){
    return new Promise((resolve, reject)=>{
        var promises = new Array()
        for(let c = 0;c<array.length;c++){
            promises.push(
                getType(array[c])
            )
        }
  
        Promise.all(promises)
        .then(results=>{
            resolve(results)
        }).catch(err=>{reject(err)})
    })
  }
  


exports.signup = (req , res , next)=>{
    console.log(req.body)
    User.findOne({email:req.body.email}).exec()
    .then(user=>{
        console.log(user)
        if(user !== null){
            return res.status(422).json({
                message:"Email already exists"
            });
        }else{
            bcrypt.hash(req.body.password , 10 , (err , hash)=>{
                if(err){
                    return res.status(500).json({
                        error: err
                    });
                } else {

                    const newuser = new User({
                        _id: new mongoose.Types.ObjectId(),
                        username:req.body.fname + " " + req.body.lname,
                        fname:req.body.fname,
                        lname:req.body.lname,
                        email: req.body.email,
                        password: hash,
                        signupDate: moment().locale('fa').format('YYYY/M/D')
                    });


                    newuser.save().then(user=>{
                        const token = jwt.sign({
                            ref:"user",
                            userId:user._id,
                        }, 
                        process.env.JWT_KEY,
                        { 
                            expiresIn:'8h'
                        });

                        res.status(201).json({
                            data:user,
                            token:token,
                            admin:false,
                            message:'user created'
                        })
                    }).catch(err=>{console.log(err);res.status(500).json({
                        type:'Internal Error',
                        message:err
                    })})

                }
            });
        }
    });
    

}


exports.getRequests = (req, res,next)=>{

    if(req.userData){
        TutorialRequest.find({user:req.userData.userId})
        .populate('repsonse').lean()
        .exec()
        .then(reqs=>{
            res.status(200).send(reqs)
        }).catch(err=>{console.log(err);res.status(500).json({message:"Error Occured",error:err})})
    }else{
        res.status(401).send("Authorization Failed")
    }

}



// I doubt it's even needed anyways
exports.getReports = (req,res,next)=>{

}

exports.getMessages = (req, res, next)=>{
    if(req.userData){

    }else{
        res.status(401).send(err)
    }
}


exports.setinfo = (req,res,next)=>{

    if(req.userData){
        const id = req.userData.userId;
        const updateOps = {}
        //great method!
        for(const ops of req.body){
            updateOps[ops.propName] = ops.value;
        }
    
            User.findByIdAndUpdate(id,{$set:updateOps},{new:true})
            .exec()
            .then(result=>{
                res.status(200).json(result);
            }).catch(err=>{
                console.log(err);
                res.status(500).json(
                    {error:err}
                );
            });
    
    }else{
        res.status(401).send("Authorization Failed")
    }

}

exports.getinfo = (req,res,next)=>{

    if(req.userData){
        User.findById(req.userData.userId).lean().exec()
        .then(user=>{
            req.status(200).send(user)
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}

exports.comment = (req,res,next)=>{

    if(req.userData){
        var body = req.body
        var now = Date.now();
        var jalaliDate = moment().locale('fa').format('YYYY/M/D');
        var comment = new Comment({
            _id:mongoose.Schema.Types.ObjectId,
            text:body.text,
            tutorial:req.params.tutorialId,
            user:req.userData.userId,
            date:jalaliDate,
            createdAt:now
        })

        comment.save()
        .then(saved=>{
            res.status(201).json({
                type:'created',
                message:'comment created'
            })
        })
        .catch(err=>{console.log(err)
            res.status(500).send({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}


exports.requestTutorial = (req,res,next)=>{

    if(req.userData){
        var title = req.body.title
        var desc = req.body.description
        var links = req.body.urls
        var createdAt = String(Date.now())
        var jalaliDate = moment().locale('fa').format('YYYY/M/D');
        getTypes(links)
        .then(materials=>{
        
            var request = new TutorialRequest({
                _id:mongoose.Types.ObjectId(),
                user:req.userFata.userId,
                createdAt:createdAt,
                date:jalaliDate,
                desc:desc,
                title:title,
                material:materials
            })

            request.save()
            .then(saved=>{
                res.status(200).send(saved)
            }).catch(err=>{console.log(err);res.status(500).send(err)})
        
        }).catch(err=>{console.log(err);res.status(500).send(err)})
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}


exports.reportTutorial = (req,res,next)=>{
    
    if(req.userData){
        var type = req.body.type
        var desc = req.body.desc
        var createdAt = String(Date.now())
        var jalaliDate = moment().locale('fa').format('YYYY/M/D');

        var report = new Report({
            _id:mongoose.Schema.Types.ObjectId,
            type:type,
            description:desc,
            tutorial:req.params.tutorialId,
            user:req.userData.userId,
            desc:desc,
            date:jalaliDate,
            createdAt:createdAt
            
        })

        report.save()
        .then(saved=>{  
            res.status(200).send(saved)
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })


    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}

exports.likeTutorial = (req, res,next)=>{
    

    if(req.userData){
        User.findById(req.userData.userId).lean().exec()
        .then(user=>{
            var exists = false;

            for(const id of user.favorites){
                if(req.params.tutorialId.toString() === id.toString())
                {exists = true; break}
            }
        
            if(exists){
                //Remove from  the favorites
                User.findByIdAndUpdate(req.userData.userId , {$pull:{favorites:req.params.tutorialId}},{new:true}).exec()
                .then(result2=>{
                    if(result2 === null) res.status(204).end();
                    else res.status(200).json({message:"Removed"})
                }).catch(err=>{console.log(err);res.status(500).send(err)})
        
                
                Tutorial.updateOne({_id:req.params.tutorialId},{$inc:{likeCount:-1}}).exec()
                .then(updated=>{}).catch(err=>{console.log(err)})
        
            }else{
                //Add to favorites
                User.findByIdAndUpdate(req.userData.userId , {$push:{favorites:req.params.tutorialId}},{new:true}).exec()
                .then(result2=>{
                    if(result2 === null) res.status(204).end();
                    else res.status(200).json({message:"Added"})
                }).catch(err=>{console.log(err);res.status(500).send(err)})
        
                Tutorial.updateOne({_id:req.params.tutorialId},{$inc:{likeCount:1}}).exec()
                .then(updated=>{}).catch(err=>{console.log(err)})

        
            }
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }
}


exports.getLiked = (req,res,next)=>{

    if(req.userData){
        User.findById(req.userData.userId).lean().exec()
        .then(user=>{
            var ids = user.favorites
            Tutorial.find({_id:{$in:ids}})
            .populate('category')
            .lean().exec()
            .then(tutorials=>{
                res.status(200).send(tutorials)
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
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}

exports.recommend = (req,res,next)=>{

    if(req.userData){
        
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}


exports.rate = (req,res,next)=>{

    if(req.userData){
        Rate.findOne({user:req.userData.userId,tutorial:req.params.tutorialId}).lean().exec()
        .then(rate=>{

            Tutorial.findById(req.params.tutorialId).lean().exec()
            .then(tutorial=>{

                if(rate){
                    var newavg = ((tutorial.rateCount * tutorial.avgRate) - rate.rate + req.body.rate) / tutorial.rateCount
                    Tutorial.updateOne({_id:tutorial._id},{$set:{avgRate:newavg}},{new:true}).exec()
                    .then(updated=>{
                        res.status(200).send(updated)
                    }).catch(err=>{console.log(err)
                        res.status(500).json({
                            type:'Internal Error',
                            message:err
                        })
                    })
                }else{
                    var newavg = ((tutorial.rateCount * tutorial.avgRate) + req.body.rate ) / (tutorial.rateCount + 1)
                    Tutorial.updateOne({_id:tutorial._id},{$set:{avgRate:newavg},$inc:{rateCount:1}},{new:true}).exec()
                    .then(rated=>{
                        res.status(200).send(rated)
                    }).catch(err=>{console.log(err)
                        res.status(500).json({
                            type:'Internal Error',
                            message:err
                        })
                    })
                }
    

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
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authorization Failed'
        })
    }

}