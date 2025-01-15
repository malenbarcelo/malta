const express = require('express')
const updateController = require('../../controllers/apisControllers/updateController.js')
const router = express.Router()

//sales_orders
router.post('/sales-orders',updateController.updateSalesOrders)

module.exports = router