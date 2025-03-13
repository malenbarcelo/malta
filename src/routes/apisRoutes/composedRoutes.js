const express = require('express')
const salesController = require('../../controllers/apisControllers/composedControllers/salesController.js')
const cuttingsController = require('../../controllers/apisControllers/composedControllers/cuttingsController.js')
const router = express.Router()

// customer balance
router.post('/print-customer-balance',salesController.printCustomerBalance)

// positive balance
router.get('/positive-balance',salesController.positiveBalance)

// last orders
router.get('/last-orders',salesController.lastOrders)

// max order number
router.get('/max-order-number',salesController.maxOrderNumber)

// predict molds
router.get('/predict-molds/:string',cuttingsController.predictMolds)

// predict molds descriptions
router.get('/predict-molds-descriptions/:string',cuttingsController.predictMoldsDescriptions)

// layers summary
router.get('/layers-summary',cuttingsController.layersSummary)

module.exports = router