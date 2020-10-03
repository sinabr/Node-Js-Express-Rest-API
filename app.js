const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyparser = require('body-parser')
const mongoose = require('mongoose');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');
const debug = require('debug')('http');
const path = require('path')
const fs = require('fs')
const rfs = require('rotating-file-stream')
const cors = require('cors');

mongoose.set('useCreateIndex', true);



mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/trainse', { useNewUrlParser: true , useUnifiedTopology: true}).catch(function (reason) {
    console.log('Unable to connect to the mongodb instance. Error: ', reason);
});


mongoose.Promise = global.Promise;

const xss = require('xss-clean');


const limiter = rateLimit({
    windowMs: 60 * 1000, // 15 minutes
    max: 30 // limit each IP to 100 requests per windowMs
  });




app.use(limiter);
app.use(helmet());
app.use(morgan('dev'));

//app.use(shouldCompress())
app.use(bodyparser.urlencoded({limit:'100mb', extended: true}));
app.use(bodyparser.json({limit:'100mb'}));
app.use(mongoSanitize())
app.use(xss());

app.set('view engine','pug')

app.use(cors())

// app.use((req , res , next)=>{
//     // debug(req.method + ' ' + req.url);
//     res.header('Access-Control-Allow-Origin' , '*');
//     res.header(
//         "Access-Control-Allow-Headers" , 
//         "Origin, X-Requested_With, Content-Type , Accept , Authorization"
//     ); 

//     if(req.method === 'OPTIONS'){
        
//         res.header(
//             'Access-Control-Allow-Methods',
//             'PUT ,POST ,PATCH , DELETE , GET'
//         );
//         return res.status(200).json({});

//     }
//     next();

// });

// let timerId = setInterval(() => {
//     //console.log("Checking Orders ... ")
//     OrdersController.checkorders()
// }, 5000);

var userRouter = require('./api/routes/user')
var adminRouter = require('./api/routes/admin')
var publicRouter = require('./api/routes/public')
var authRouteer = require('./api/routes/login')
var backadminRouter = require('./api/routes/backendadmin')

console.log("Routes Activated ...")

// handle requests
app.use('/user' , userRouter  );
app.use('/admin' , adminRouter)
app.use('/public',publicRouter)
app.use('/auth',authRouteer)
app.use('/backadmin',backadminRouter)


// if reaches here , is error
app.use((req , res , next)=>{
    res.status(404).send("Welcome to Trainse API!")
    // next(error);
});

// app.use((error , req , res , next)=>{
//     res.status(error.status || 500);
//     res.json({
//         error:{
//             message:error.message
//         }
//     });
// });


module.exports = app;
