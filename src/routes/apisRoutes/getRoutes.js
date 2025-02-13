const express = require('express')
const getController = require('../../controllers/apisControllers/getController.js')
const router = express.Router()

// seasons
router.get('/seasons',getController.getSeasons)

// data_customers
router.get('/data-customers',getController.getCustomers)

// products
router.get('/cuttings-products',getController.getProducts)

// sales_transactions
router.get('/sales-transactions',getController.getTransactions)

// sales_orders
router.get('/sales-orders',getController.getOrders)

// sales_orders_details
router.get('/sales-orders-details',getController.getOrdersDetails)

module.exports = router