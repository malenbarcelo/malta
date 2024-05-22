const express = require('express')
const apisSalesController = require('../controllers/apisControllers/apisSalesController.js')
const apisCuttingsController = require('../controllers/apisControllers/apisCuttingsController.js')
const apisDataController = require('../controllers/apisControllers/apisDataController.js')
const router = express.Router()


//sales
router.get('/sales/orders',apisSalesController.orders)
router.get('/sales/:salesChannel/new-order',apisSalesController.newOrder)
router.post('/sales/save-order',apisSalesController.saveOrder)

//cuttings
router.get('/cuttings/product-options/:productDescription',apisCuttingsController.productOptions)
router.get('/cuttings/sizes-options/:productDescription/:color',apisCuttingsController.sizeOptions)
router.get('/cuttings/colors-options/:productDescription/:size',apisCuttingsController.colorOptions)

//data
router.get('/data/customers',apisDataController.customers)
router.get('/data/products',apisDataController.products)


module.exports = router