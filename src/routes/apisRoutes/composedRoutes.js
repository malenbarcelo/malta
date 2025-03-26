const express = require('express')
const salesController = require('../../controllers/apisControllers/composedControllers/salesController.js')
const cuttingsController = require('../../controllers/apisControllers/composedControllers/cuttingsController.js')
const router = express.Router()

// print customer balance
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

// predict cuttings descriptions
router.get('/predict-cuttings-descriptions/:string',cuttingsController.predictCuttingsDescriptions)

// max id layers
router.get('/max-id-layers',cuttingsController.maxIdLayers)

// max cutting number
router.get('/max-cutting-number',cuttingsController.maxCuttingNumber)

// print cutting order
router.post('/print-cutting-order',cuttingsController.printCuttingOrder)

module.exports = router