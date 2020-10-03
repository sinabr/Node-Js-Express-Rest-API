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


var publicController = require('../controller/public.js')

router.get('/categories/getall' , publicController.allCategories)
router.get('/category/tutorials/:categoryId' , publicController.categoryTutorials)
router.get('/tutorial/get/:tutorialId' , publicController.getTutorial)
router.post('/search' , publicController.search)
router.get('/tutorial/comments/:tutorialId',publicController.tutorialComments)
router.get('/tutorial/getall',publicController.getAllTutorials)

module.exports = router