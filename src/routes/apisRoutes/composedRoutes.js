const express = require('express')
const composedController = require('../../controllers/apisControllers/composedControllers/salesController.js')
const router = express.Router()

// customer balance
router.post('/print-customer-balance',composedController.printCustomerBalance)

// positive balance
router.get('/positive-balance',composedController.positiveBalance)

// last orders
router.get('/last-orders',composedController.lastOrders)

// max order number
router.get('/max-order-number',composedController.maxOrderNumber)

module.exports = router