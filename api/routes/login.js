const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');


var authController = require('../controller/login.js')

router.post('/login' , authController.login)
router.post('/logout' , authController.logout)

module.exports = router