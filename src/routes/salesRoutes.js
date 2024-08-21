const express = require('express')
const salesController = require('../controllers/salesController.js')
const ordersController = require('../controllers/sales/ordersController.js')
const router = express.Router()

router.get('/in-progress-orders/details',salesController.inProgressOrdersDetails)
router.get('/in-progress-orders',salesController.inProgressOrders)
router.get('/consolidated',salesController.sales)
router.get('/statistics/sales',salesController.salesStatistics)
//router.get('/statistics/sales-channel',salesController.salesChannel)
//router.get('/statistics/clients',salesController.clients)
//router.get('/statistics/products',salesController.products)


//---APIS---//
//customers
router.get('/customers-summary',ordersController.customersSummary)
router.get('/customer-movements/:idCustomer',ordersController.customerMovements)
router.post('/post-notes',ordersController.postNotes)

//payments
router.post('/register-customer-payment',ordersController.saveCustomerPayment)

//orders
router.post('/update-payment-status',ordersController.updatePaymentStatus)










module.exports = router