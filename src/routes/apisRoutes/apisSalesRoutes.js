const express = require('express')
const apisSalesController = require('../../controllers/apisControllers/apisSalesController.js')
const apisWordpressController = require('../../controllers/apisControllers/apisWordpressController.js')
const router = express.Router()

router.get('/in-progress-orders',apisSalesController.inProgressOrders)
router.get('/in-progress-orders/show-canceled',apisSalesController.inProgressOrdersShowCanceled)
router.get('/in-progress-orders/details',apisSalesController.inProgressOrdersDetails)
router.get('/in-progress-orders/payments',apisSalesController.inProgressOrdersPayments)
router.get('/new-order',apisSalesController.newOrder)
router.get('/customer-positive-balance/:idCustomer',apisSalesController.customerPositiveBalance)
router.get('/consolidated-sales/:year',apisSalesController.consolidatedSales)
router.post('/save-order',apisSalesController.saveOrder)
router.post('/edit-order',apisSalesController.editOrder)
router.post('/register-payment',apisSalesController.registerPayment)
router.post('/set-payment-verification',apisSalesController.setPaymentVerification)
router.post('/register-account-movement',apisSalesController.registerAccountMovement)
router.post('/deliver-order',apisSalesController.deliverOrder)
router.post('/assign-order-manager',apisSalesController.assignOrderManager)
router.post('/cancel-order',apisSalesController.cancelOrder)
router.post('/restore-order',apisSalesController.restoreOrder)
router.post('/cancel-order-ninox',apisSalesController.cancelOrderNinox)

//orders
router.post('/edit-order-observations',apisSalesController.editOrderObs)

//orders-details
router.post('/cancel-order-detail',apisSalesController.cancelOrderDetail)
router.post('/edit-order-detail',apisSalesController.editOrderDetail)
router.post('/edit-order-detail-observations',apisSalesController.editOrderDetailObs)


//router.post('/delete-product',apisSalesController.deleteProduct)
//router.post('/update-payment-status',apisSalesController.updatePaymentStatus)
router.get('/predict-sales-numbers/:string',apisSalesController.predictSalesNumbers)

//wordpress data
router.get('/wp/new-orders-data',apisWordpressController.newOrdersData)
//router.get('/wp/get-wp-posts',apisWordpressController.getWpPosts)

module.exports = router