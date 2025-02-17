const express = require('express')
const getController = require('../../controllers/apisControllers/getController.js')
const router = express.Router()

// seasons
router.get('/seasons',getController.getSeasons)

// data_customers
router.get('/data-customers',getController.getCustomers)

// cuttings-products
router.get('/cuttings-products',getController.getProducts)

// cuttings-products-colors
router.get('/cuttings-products-colors',getController.getProductsColors)

// cuttings-products-sizes
router.get('/cuttings-products-sizes',getController.getProductsSizes)

// sales_transactions
router.get('/sales-transactions',getController.getTransactions)

// sales_orders
router.get('/sales-orders',getController.getOrders)

// sales_orders_details
router.get('/sales-orders-details',getController.getOrdersDetails)

// sales_orders_details_colors
router.get('/sales-orders-details-colors',getController.getOrdersDetailsColors)

// sales_orders_details
router.get('/sales-orders-details-sizes',getController.getOrdersDetailsSizes)

module.exports = router