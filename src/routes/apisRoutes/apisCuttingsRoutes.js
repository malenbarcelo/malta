const express = require('express')
const apisCuttingsController = require('../../controllers/apisControllers/apisCuttingsController')
const router = express.Router()

router.post('/product-options',apisCuttingsController.productOptions)
router.post('/sizes-options',apisCuttingsController.sizeOptions)
router.post('/colors-options',apisCuttingsController.colorOptions)

module.exports = router