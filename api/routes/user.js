const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const path = require('path')
const multer = require('multer');
const formidableMiddleware = require('express-formidable')

var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '')
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now())
  }
})

upath = path.join(__dirname, '..', '..', '/uploads') 

var upload = multer({ storage: storage })


var userController = require('../controller/user.js')

router.post('/signup' , userController.signup)
router.get('/info' , checkAuth , userController.getinfo)
router.post('/request/tutorial' , checkAuth , userController.requestTutorial)
router.post('/report/tutorial/:tutorialId',checkAuth,userController.reportTutorial)
router.post('/like/tutorial/:tutorialId',checkAuth,userController.likeTutorial)
router.get('/like/getall' , checkAuth,userController.getLiked)
router.get('/recommended/get' , checkAuth,userController.recommend)
router.post('/rate/tutorial/:tutorialId' ,checkAuth,userController.rate)

module.exports = router