const express = require('express')
const composedController = require('../../controllers/apisControllers/composedControllers/salesController.js')
const router = express.Router()

//data_customers
router.post('/print-customer-balance',composedController.printCustomerBalance)

module.exports = router