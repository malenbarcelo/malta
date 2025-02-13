const express = require('express')
const updateController = require('../../controllers/apisControllers/updateController.js')
const router = express.Router()

//sales_orders
router.post('/sales-orders',updateController.updateOrders)

//sales_orders_details
router.post('/sales-orders-details',updateController.updateOrdersDetails)

//sales_payments
router.post('/sales-payments',updateController.updatePayments)

//sales_payments_assignations
router.post('/sales-payments-assignations',updateController.updatePaymentsAssignations)

//data_customers
router.post('/data-customers',updateController.updateCustomers)

module.exports = router