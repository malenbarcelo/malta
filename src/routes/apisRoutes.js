const express = require('express')
const apisSalesController = require('../controllers/apisControllers/apisSalesController.js')
const apisCuttingsController = require('../controllers/apisControllers/apisCuttingsController.js')
const apisDataController = require('../controllers/apisControllers/apisDataController.js')
const apisWordpressController = require('../controllers/apisControllers/apisWordpressController.js')
const router = express.Router()

//sales
router.get('/sales/in-progress-orders',apisSalesController.inProgressOrders)
router.get('/sales/in-progress-orders/payments',apisSalesController.inProgressOrdersPayments)
router.get('/sales/:salesChannel/new-order',apisSalesController.newOrder)
router.post('/sales/save-order',apisSalesController.saveOrder)
router.post('/sales/register-payment',apisSalesController.registerPayment)
router.post('/sales/deliver-order',apisSalesController.deliverOrder)
router.post('/sales/assign-order-manager',apisSalesController.assignOrderManager)
router.post('/sales/cancel-order',apisSalesController.cancelOrder)
router.get('/sales/get-ninox-sales',apisSalesController.getNinoxSales)

//cuttings
router.get('/cuttings/product-options/:productDescription',apisCuttingsController.productOptions)
router.get('/cuttings/sizes-options/:productDescription/:color',apisCuttingsController.sizeOptions)
router.get('/cuttings/colors-options/:productDescription/:size',apisCuttingsController.colorOptions)

//data
router.get('/data/customers',apisDataController.customers)
router.get('/data/products',apisDataController.products)
router.get('/data/orders-managers',apisDataController.ordersManagers)
router.get('/data/products/predict-products/:string',apisDataController.predictProducts)

//wordpress data
//router.get('/wp/get-new-orders',apisWordpressController.getNewOrders)
//router.get('/wp/get-wp-posts',apisWordpressController.getWpPosts)


module.exports = router