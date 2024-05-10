const express = require('express')
const apisCuttingsController = require('../controllers/apisControllers/apisCuttingsController.js')
const router = express.Router()

//cuttings
router.get('/cuttings/product-options/:productDescription',apisCuttingsController.productOptions)


module.exports = router