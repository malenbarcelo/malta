const express = require('express')
const createController = require('../../controllers/apisControllers/createController.js')
const router = express.Router()

//sales_transactions
router.post('/sales-transactions',createController.createTransactions)

//sales_orders
router.post('/sales-orders',createController.createOrders)

//sales_orders_details
router.post('/sales-orders-details',createController.createOrdersDetails)

//sales_orders_details_colors
router.post('/sales-orders-details-colors',createController.createDetailsColors)

//sales_orders_details_sizes
router.post('/sales-orders-details-sizes',createController.createDetailsSizes)

module.exports = router