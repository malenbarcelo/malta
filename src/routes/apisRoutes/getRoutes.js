const express = require('express')
const getController = require('../../controllers/apisControllers/getController.js')
const cuttingsController = require('../../controllers/apisControllers/getControllers/cuttingsController.js')
const router = express.Router()

// seasons
router.get('/seasons',getController.getSeasons)

// data_customers
router.get('/data-customers',getController.getCustomers)

// cuttings
router.get('/cuttings',cuttingsController.getCuttings)

// cuttings_products
router.get('/cuttings-products',getController.getProducts)

// cuttings_products_colors
router.get('/cuttings-products-colors',getController.getProductsColors)

// cuttings_products_sizes
router.get('/cuttings-products-sizes',getController.getProductsSizes)

// cuttings_molds
router.get('/cuttings-molds',cuttingsController.getMolds)

// cuttings_layers
router.get('/cuttings-layers',cuttingsController.getLayers)

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

// users
router.get('/users',getController.getUsers)



module.exports = router