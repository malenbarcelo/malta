const express = require('express')
const apisCuttingsController = require('../../controllers/apisControllers/apisCuttingsController')
const router = express.Router()

router.get('/product-options/:productDescription',apisCuttingsController.productOptions)
router.get('/sizes-options/:productDescription/:color',apisCuttingsController.sizeOptions)
router.get('/colors-options/:productDescription/:size',apisCuttingsController.colorOptions)

module.exports = router