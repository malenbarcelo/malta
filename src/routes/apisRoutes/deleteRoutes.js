const express = require('express')
const deleteController = require('../../controllers/apisControllers/deleteController.js')
const cuttingsController = require('../../controllers/apisControllers/deleteControllers/cuttingsController.js')
const router = express.Router()

// sales_orders_details
router.post('/sales-orders-details',deleteController.deleteOrdersDetails)

// sales_orders_details_colors
router.post('/sales-orders-details-colors',deleteController.deleteOrdersDetailsColors)

// sales_orders_details_sizes
router.post('/sales-orders-details-sizes',deleteController.deleteOrdersDetailsSizes)

// cuttings_layers
router.post('/cuttings-layers',cuttingsController.deleteLayers)


module.exports = router