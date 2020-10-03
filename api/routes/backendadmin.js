const express = require('express');
const router = express.Router();


var backadminController = require('../controller/backadmin.js')

router.post('/add/admin' ,backadminController.addAdmin)
router.post('/add/samplecatgs' ,backadminController.sampleCategories)

module.exports = router