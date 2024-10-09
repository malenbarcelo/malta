const express = require('express')
const apisDataController = require('../../controllers/apisControllers/apisDataController')
const router = express.Router()

router.get('/customers',apisDataController.customers)
router.get('/sales-channels',apisDataController.salesChannels)
router.get('/orders-managers',apisDataController.ordersManagers)
router.get('/customers/predict-customers/:string',apisDataController.predictCustomers)

module.exports = router