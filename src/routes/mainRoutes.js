const express = require('express')
const mainController = require('../controllers/mainController.js')
const mainApisController = require('../controllers/mainApisController.js')
const loginValidations = require('../validations/loginValidations.js')
const authMiddleware = require('../middlewares/authMidleware.js')
const router = express.Router()

//---CACKEND---//
router.get('/',mainController.login)
router.post('/login',loginValidations.login,mainController.loginProcess)
router.get('/logout',mainController.logoutProcess)
router.get('/main-menu',authMiddleware,mainController.mainMenu)

//---APIS---//
router.get('/current-season',mainApisController.currentSeason)
router.post('/new-season',mainApisController.newSeason)


module.exports = router