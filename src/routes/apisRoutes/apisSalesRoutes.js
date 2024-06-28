const express = require('express')
const apisSalesController = require('../../controllers/apisControllers/apisSalesController.js')
const apisWordpressController = require('../../controllers/apisControllers/apisWordpressController.js')
const router = express.Router()

router.get('/in-progress-orders',apisSalesController.inProgressOrders)
router.get('/in-progress-orders/details',apisSalesController.inProgressOrdersDetails)
router.get('/in-progress-orders/payments',apisSalesController.inProgressOrdersPayments)
router.get('/new-order',apisSalesController.newOrder)
router.get('/customer-positive-balance/:idCustomer',apisSalesController.customerPositiveBalance)
router.post('/save-order',apisSalesController.saveOrder)
router.post('/register-payment',apisSalesController.registerPayment)
router.post('/register-account-movement',apisSalesController.registerAccountMovement)
router.post('/deliver-order',apisSalesController.deliverOrder)
router.post('/assign-order-manager',apisSalesController.assignOrderManager)
router.post('/cancel-order',apisSalesController.cancelOrder)
router.get('/consolidated-sales/:year',apisSalesController.consolidatedSales)

//ninox data
router.get('/get-ninox-sales',apisSalesController.getNinoxSales)

//wordpress data
//router.get('/wp/get-new-orders',apisWordpressController.getNewOrders)
//router.get('/wp/get-wp-posts',apisWordpressController.getWpPosts)

module.exports = router