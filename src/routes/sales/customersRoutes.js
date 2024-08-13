const express = require('express')
const customersController = require('../../controllers/sales/customersController')
const router = express.Router()

//(/sales/customers)
router.get('/',customersController.customers)

//APIS (sales/customers/apis)
router.get('/customers-summary',customersController.customersSummary)







module.exports = router