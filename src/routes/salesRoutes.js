const express = require('express')
const salesController = require('../controllers/salesController.js')
const router = express.Router()

router.get('/orders',salesController.orders)
router.get('/consolidated',salesController.consolidated)
router.get('/customers-data',salesController.customersData)
router.get('/statistics/sales',salesController.salesStatistics)
//router.get('/statistics/sales-channel',salesController.salesChannel)
//router.get('/statistics/clients',salesController.clients)
//router.get('/statistics/products',salesController.products)

module.exports = router