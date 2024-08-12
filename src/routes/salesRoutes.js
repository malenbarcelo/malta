const express = require('express')
const salesController = require('../controllers/salesController.js')
const router = express.Router()

router.get('/in-progress-orders/details',salesController.inProgressOrdersDetails)
router.get('/in-progress-orders',salesController.inProgressOrders)
router.get('/consolidated',salesController.sales)
router.get('/statistics/sales',salesController.salesStatistics)
//router.get('/statistics/sales-channel',salesController.salesChannel)
//router.get('/statistics/clients',salesController.clients)
//router.get('/statistics/products',salesController.products)









module.exports = router