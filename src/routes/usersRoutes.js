const express = require('express')
const usersController = require('../controllers/usersController.js')
//const userFormsValidations = require('../validations/userFormsValidations.js')
const router = express.Router()

router.post('/main-menu',usersController.loginProcess)

module.exports = router

