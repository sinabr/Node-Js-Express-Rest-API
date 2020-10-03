const mongoose = require('mongoose');
const Address = require('../model/user')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const randomstring = require('randomstring')
const fs = require('fs');
const promisify = require('promisify-any')
const moment = require('jalali-moment')

const TutorialRequest = require('../model/tutorialRequest')
const TutorialResponse = require('../model/tutorialResponse')
const RequestMaterial = require('../model/tutorialResponse')
const Comment = require('../model/comment')
const Category = require('../model/category')
const Resource = require('../model/resource')
const Report = require('../model/report')
const Request = require('../model/tutorialRequest')
const Tutorial = require('../model/tutorial')
const Admin = require('../model/admin')
// const Message = require('../model/')


//Reommendation System

var recombee = require('recombee-api-client');
var rqs = recombee.requests;
var client = new recombee.ApiClient('sehub-dev', 
"OdKn3zTNQwInTkXqLHkWZqGCFmWzXXnmX3cF7aAvEJO9IrH0nKG5VqhafKhlk0kU"
);
// client.send(new rqs.AddItem("item21"), (err,data)=>{console.log(err);console.log(data)});

//FTP
const ftp = require('basic-ftp')



async function ftpUploadImage(sourcename,destname){
    return new Promise(async (resolve,reject)=>{
        console.log("connecting to ftp ...")
        const client = new ftp.Client()
        client.ftp.verbose = true

        try {
            await client.access({
                host: "130.185.79.155",
                user: "pz11315",
                password: 'sg8Jwej3',
                secure: false
            })
            await client.cd('public_html/categories/');
            await client.uploadFrom(sourcename , destname);
            client.close();
            return true;
        }
        catch(err) {
            console.log(err);
            client.close();
            return false;
        }
    })
}
ftpUploadImage = promisify(ftpUploadImage , 2)

async function ftpUploadTutorial(sourcename,destname){
    console.log(sourcename)
    console.log(destname)
    return new Promise(async (resolve,reject)=>{
        console.log("connecting to ftp ...")
        const client = new ftp.Client()
        client.ftp.verbose = true

        try {
            await client.access({
                host: "130.185.79.155",
                user: "pz11315",
                password: 'sg8Jwej3',
                secure: false
            })
            await client.cd('public_html/tutorials/');
            await client.uploadFrom(sourcename , destname);
            client.close();
            return true;
        }
        catch(err) {
            console.log(err);
            client.close();
            return false;
        }
    })
}
ftpUploadTutorial = promisify(ftpUploadTutorial , 2)

// MAIL

const nodemailer = require('nodemailer');
const pug = require('pug')



var admintransporter = nodemailer.createTransport({
    host: 'mail.sehub.ir',
    port:587,
    auth: {
      user: 'support@sehub.ir',
      pass: 'sina134679'
    },
    tls: {
        rejectUnauthorized: false
    }
});

var url = 'https://google.com'

var mailOptions = {
    from: 'support@sehub.ir',
    to: 'sina.br.shirazu@gmail.com',
    subject: 'Welcome to Sehub Community',
    html: pug.renderFile('./views/welcome.pug' , {url:url}) 
};

//Send Email
// admintransporter.sendMail(mailOptions, function(error, info){
//     if (error) {
//         console.log(error);
//     } else {
//         console.log('Email sent: ' + info.response);
//     }
// }); 


exports.getRequests = (req , res , next)=>{

    res.status(200).json([
        {
            _id:'Id_1',
            user:{_id:'userOne',username:'ali_ghasemi'},
            type:'Request',
            response:null,
            material:[{url:'https://www.w3schools.com/bootstrap/bootstrap_ver.asp',info:{type:'text',desc:'this is a bootstrap tutorial',trusted:true}}],
            desc:"add a bootstrap tutorial to yourwebsite please",
            date:'7/18/2020',
            checked:false
        },
        {
            _id:'Id_2',
            user:{_id:'userTwo',username:'abbas001'},
            type:'Suggestion',
            response:null,
            material:[{url:'https://www.youtube.com/watch?v=3VTsIju1dLI',info:{type:'video',desc:'this video is from youtube',trusted:false}}],
            desc:"this is a video from somewebiste",
            date:'7/18/2020',
            checked:false
        }
    ])
    // if(req.adminData){
    //     TutorialRequest.find({checked:false}).sort({createdAt:-1}).lean().exec()
    //     .then(reqs=>{
    //         res.status(200).send(reqs)
    //     }).catch(err=>{
    //         console.log(err)
    //         res.status(500).json({
    //             type:'Internal Error',
    //             message:err
    //         })
    //     })
    // }else{
    //     res.status(401).json({
    //         type:'Auth',
    //         message:'Authentication Failed'
    //     })
    // } 
}


exports.getReports = (req,res,next)=>{

    if(req.adminData){
        Report.find({checked:false}).sort({createdAt:-1})
        .lean()
        .populate('user','email username _id')
        .exec()
        .then(reports=>{
            res.status(200).send(reports)
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    } 

}

exports.removeComment = (req,res,next)=>{
    if(req.adminData){
        Comment.deleteOne({_id:req.params.commentId}).exec()
        .then(rmvd=>{
            res.status(200).end()
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }
}

exports.addTutorial = (req, res,next)=>{
    console.log("here")
    if(req.adminData){
        console.log(req.body)
        var body = req.body
        var createdAt = String(Date.now())
        var jalaliDate = moment().locale('fa').format('YYYY/M/D');

        var language = 'En'
        var instructors = []
        var publisher = "sina"

        if(body.language){
            language = body.language
        }

        if(body.instructors){
            instructors = body.instructors
        }

        if(body.publisher){
            publisher = body.publisher
        }

        // req.status(200).send("GOT IT")

        Admin.findById(req.adminData.adminId).lean().exec()
        .then(admin=>{
            Category.updateOne({_id:req.body.categoryId},{$inc:{tutorialCount:1}},{new:true}).exec()
            .then(added=>{

                var material = JSON.stringify(req.body.material);
                var a = randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
                });

                var fileName = 'FJson' + a + '.json'

                // fs.writeFile(fileName, material, 'utf8', function (err) {
                //     if (err) {
                //         console.log("An error occured while writing JSON Object to File.");
                //         console.log(err);
                //         res.status(500).json({
                //             type:'FileSystem Error',
                //             message:err
                //         })
                //     }else{
                //         var l = randomstring.generate({
                //             length: 12,
                //             charset: 'alphabetic'
                //         });
                //         var destName = added._id + l + '.json'
                //         // ftpUploadTutorial(fileName,destName)
                //         // .then(uploaded=>{
                //         //     console.log("Out Of FTP")
                //         //     url = 'http://dl.sehub.ir/tutorials/'+destName
                //         //     var tutorial = new Tutorial({
                //         //         _id:mongoose.Types.ObjectId,
                //         //         title:body.title,
                //         //         category:body.categoryId,
                //         //         tags:body.tags,
                //         //         description:body.description,
                //         //         instructors:instructors,
                //         //         publisher:publisher,
                //         //         createdAt:createdAt,
                //         //         date:jalaliDate,
                //         //         language:language,
                //         //         material:material
                //         //     })
        
                //         //     tutorial.save()
                //         //     .then(saved=>{
                //         //         res.status(201).send(saved)
                //         //     }).catch(err=>{console.log(err);res.status(500).send(err)})

                //         // }).catch(err=>{console.log(err)
                //         //     res.status(500).json({
                //         //         type:'FTP Error',
                //         //         message:err
                //         //     })
                //         // })




                //     }
                 
                // });

                var tutorial = new Tutorial({
                    _id:mongoose.Types.ObjectId(),
                    title:body.title,
                    category:body.categoryId,
                    tags:body.tags,
                    description:body.description,
                    instructors:instructors,
                    publisher:publisher,
                    createdAt:createdAt,
                    date:jalaliDate,
                    language:language,
                    material:material
                })

                tutorial.save()
                .then(saved=>{
                    res.status(201).send(saved)
                    // client.send(new rqs.AddItem(saved._id), (err,data)=>{console.log(err);console.log(data)});

                }).catch(err=>{console.log(err);res.status(500).send(err)})


            }).catch(err=>{console.log(err);res.status(500).send(err)})
        }).catch(err=>{console.log(err)
            res.status(500).json({
                type:'Internal Error',
                message:err
            })
        })
    }else{
        console.log("auth failed route")
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }
}

exports.addCategory = (req,res,next)=>{
    if(req.adminData){
        var body = req.body
        if(!body.parentId){
            //File Adding Part Remains
            console.log(req.file)
            if(req.file.fieldname !== undefined){

                var name = randomstring.generate({
                    length: 12,
                    charset: 'alphabetic'
                });
                
                let img = req.file.path                         //let img = req.file.originalname;
                let image = body.title+name+ '.' + req.file.originalname.split('.')[1]
                console.log(image)
                var url = "http://dl.sehub.ir/categories/"+image
                // ftpUploadImage(img,image).then(reslt=>{
                //     var category = new Category({
                //         _id:mongoose.Types.ObjectId(),
                //         title:body.title,
                //         image:url
                //     })
        
                //     category.save()
                //     .then(saved=>{
                        
                //         res.status(201).send(saved)
        
                //     }).catch(err=>{console.log(err)
                //         res.status(500).json({
                //             type:'Internal Error',
                //             message:err
                //         })
                //     })
                // }).catch(err=>{console.log(err)
                //     res.status(500).json({
                //         type:'Internal Error',
                //         message:err
                //     })
                // })
                var category = new Category({
                    _id:mongoose.Types.ObjectId(),
                    title:body.title
                })
    
                category.save()
                .then(saved=>{
                    
                    res.status(201).send(saved)
    
                }).catch(err=>{console.log(err)
                    res.status(500).json({
                        type:'Internal Error',
                        message:err
                    })
                })
            }

        }else{
            var category = new Category({
                _id:mongoose.Types.ObjectId(),
                title:body.title,
                image:null
            })

            category.save()
            .then(saved=>{
                
                Category.findByIdAndUpdate(body.parentId,{$push:{children:saved._id}}).exec()
                .then(done=>{
                    
                    res.status(201).send(saved)

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
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }
}


exports.addResource = (req,res,next)=>{

    if(req.adminData){
        var body = req.body
        var resource = new Resource({
            _id:mongoose.Types.ObjectId,
            title:body.title,
            source:body.source,
            url:body.url,
            trustLevel:body.trustLevel,
            desc:body.desc
        })

        resource.save()
        .then(added=>{

        }).catch(err=>{

        })

    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }

}


exports.respondRequest = (req,res,next)=>{

    if(req.adminData){
        Request.findById(req.params.requestId)
        .lean()
        .populate('user')
        .exec()
        .then(request=>{

            Request.updateOne({_id:request._id},{$set:{checked:true}}).exec()
            .then(done=>{
                console.log("Updated")
            }).catch(err=>{console.log(err)})

            // var resp = new RequestResponse

            var mailOptions = {
                from: 'support@sehub.ir',
                to: request.user.email,
                subject: 'Response To Your Request',
                html: pug.renderFile('./views/respondRequest.pug' , 
                {
                    requestTitle:request.title,
                    requestDesc:request.desc,
                    responseTitle:req.body.title,
                    responseDesc:req.body.description
                }) 
            };
            
            //Send Email
            admintransporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).send("EMAIL SENT")
                    console.log('Email sent: ' + info.response);
                }
            }); 


        }).catch(err=>{console.log(err);res.status(500).send(err)})
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }

}


exports.respondReport = (req,res,next)=>{

    if(req.adminData){
        Report.findById(req.params.reportId)
        .lean()
        .populate('user')
        .populate('tutorial')
        .exec()
        .then(report=>{



            var mailOptions = {
                from: 'support@sehub.ir',
                to: report.user.email,
                subject: 'Response To Your Request',
                html: pug.renderFile('./views/respondRequest.pug' , 
                {
                    tutorialTitle:report.tutorial.title,
                    reportTitle:request.title,
                    reportDesc:request.desc,
                    responseTitle:req.body.title,
                    responseDesc:req.body.description
                }) 
            };
            
            //Send Email
            admintransporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).send("EMAIL SENT")
                    console.log('Email sent: ' + info.response);
                }
            }); 


        }).catch(err=>{console.log(err);res.status(500).send(err)})
    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }

}


exports.assistSearch = (req,res,next)=>{

    if(req.adminData){
        var body = req.body
        if(body.type == 'webpage'){

        }

        if(body.type == 'image'){

        }

        if(body.type == 'video'){

        }

        else{

            res.status(400).send("BAD REQUEST ENTRY:: TYPE")

        }

    }else{
        res.status(401).json({
            type:'Auth',
            message:'Authentication Failed'
        })
    }

}