const express = require('express')
const apisDataController = require('../../controllers/apisControllers/apisDataController')
const paymentMethodsController = require('../../controllers/sales/paymentMethodsController')
const shippingMethodsController = require('../../controllers/sales/shippingMethodsController')
const router = express.Router()

router.get('/customers',apisDataController.customers)
router.get('/sales-channels',apisDataController.salesChannels)
router.get('/orders-managers',apisDataController.ordersManagers)
router.get('/customers/predict-customers/:string',apisDataController.predictCustomers)
router.get('/customers/predict-customers/:idSalesChannels/:string',apisDataController.predictChannelCustomers)
router.get('/customers/web/predict-customers/:string',apisDataController.predictCustomersWeb)

router.get('/payment-methods',paymentMethodsController.paymentMethods)
router.get('/shipping-methods',shippingMethodsController.getData)

module.exports = router