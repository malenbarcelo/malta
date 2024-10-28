const express = require('express')
const apisDataController = require('../../controllers/apisControllers/apisDataController')
const paymentMethodsController = require('../../controllers/sales/paymentMethodsController')
const router = express.Router()

router.get('/customers',apisDataController.customers)
router.get('/sales-channels',apisDataController.salesChannels)
router.get('/orders-managers',apisDataController.ordersManagers)
router.get('/customers/predict-customers/:string',apisDataController.predictCustomers)
router.get('/payment-methods',paymentMethodsController.paymentMethods)

module.exports = router