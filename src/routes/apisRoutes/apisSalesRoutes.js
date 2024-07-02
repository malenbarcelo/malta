const express = require('express')
const apisSalesController = require('../../controllers/apisControllers/apisSalesController.js')
const apisWordpressController = require('../../controllers/apisControllers/apisWordpressController.js')
const router = express.Router()

router.get('/in-progress-orders',apisSalesController.inProgressOrders)
router.get('/in-progress-orders/details',apisSalesController.inProgressOrdersDetails)
router.get('/in-progress-orders/payments',apisSalesController.inProgressOrdersPayments)
router.get('/new-order',apisSalesController.newOrder)
router.get('/customer-positive-balance/:idCustomer',apisSalesController.customerPositiveBalance)
router.get('/consolidated-sales/:year',apisSalesController.consolidatedSales)
router.post('/save-order',apisSalesController.saveOrder)
router.post('/register-payment',apisSalesController.registerPayment)
router.post('/register-account-movement',apisSalesController.registerAccountMovement)
router.post('/deliver-order',apisSalesController.deliverOrder)
router.post('/assign-order-manager',apisSalesController.assignOrderManager)
router.post('/cancel-order',apisSalesController.cancelOrder)
router.post('/delete-product',apisSalesController.deleteProduct)
router.post('/update-payment-status',apisSalesController.updatePaymentStatus)

//wordpress data
//router.get('/wp/get-new-orders',apisWordpressController.getNewOrders)
//router.get('/wp/get-wp-posts',apisWordpressController.getWpPosts)

module.exports = router