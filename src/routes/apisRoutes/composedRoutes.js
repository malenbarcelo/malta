const express = require('express')
const composedController = require('../../controllers/apisControllers/composedControllers/salesController.js')
const router = express.Router()

// data_customers
router.post('/print-customer-balance',composedController.printCustomerBalance)

// sales_transactions
router.get('/positive-balance',composedController.positiveBalance)

// last_orders
router.get('/last-orders',composedController.lastOrders)

module.exports = router