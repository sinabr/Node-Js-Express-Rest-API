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


var adminController = require('../controller/admin.js')

router.get('/request/getall' /*, checkAuth */, adminController.getRequests)
router.post('/category/addnew' , checkAuth , adminController.addCategory)
router.post('/add/tutorial' , checkAuth , adminController.addTutorial)
router.delete('comment/remove/:commentId' , checkAuth , adminController.removeComment)
router.get('/report/getall' , checkAuth , adminController.getReports)
router.post('/add/resource' , checkAuth , adminController.addResource)
router.post('/respond/request/:requestId' , checkAuth,adminController.respondRequest)
router.post('/respond/report/:reportId' , checkAuth , adminController.respondReport)
router.post('/assist/search',checkAuth,adminController.assistSearch)

module.exports = router