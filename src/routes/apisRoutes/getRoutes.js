const express = require('express')
const getController = require('../../controllers/apisControllers/getController.js')
const router = express.Router()

//seasons
router.get('/seasons',getController.getSeasons)

//data_customers
router.get('/data-customers',getController.getCustomers)

//products
router.get('/cuttings-products',getController.getProducts)

module.exports = router