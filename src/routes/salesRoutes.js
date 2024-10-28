const express = require('express')
const salesController = require('../controllers/salesController.js')
const ordersController = require('../controllers/sales/ordersController.js')
const customersController = require('../controllers/sales/customersController.js')
const paymentMethodsController = require('../controllers/sales/paymentMethodsController.js')
const router = express.Router()

//---BACKEND---//
router.get('/in-progress-orders/details',salesController.inProgressOrdersDetails)
router.get('/in-progress-orders',salesController.inProgressOrders)
router.get('/consolidated',salesController.sales)
router.get('/customers',salesController.customers)
router.get('/payment-methods',salesController.paymentMethods)


//---APIS---//
//customers
router.get('/customers-summary',ordersController.customersSummary)
router.get('/customer-movements/:idCustomer',ordersController.customerMovements)
router.post('/post-notes',ordersController.postNotes)
router.post('/create-customer',customersController.createCustomer)
router.post('/edit-customer',customersController.editCustomer)
router.post('/delete-customer',customersController.deleteCustomer)
router.post('/create-payment-method',paymentMethodsController.createPaymentMethod)
router.post('/edit-payment-method',paymentMethodsController.editPaymentMethod)
router.post('/delete-payment-method',paymentMethodsController.deletePaymentMethod)

//payments
router.post('/register-customer-payment',ordersController.saveCustomerPayment)

//orders
router.post('/update-payment-status',ordersController.updatePaymentStatus)










module.exports = router