const express = require('express')
const multer = require('multer')
const path = require('path')
const createController = require('../../controllers/apisControllers/createController.js')
const cuttingsController = require('../../controllers/apisControllers/createControllers/cuttingsController.js')
const router = express.Router()

//multer config
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.resolve('public/images/moldsImages'))  
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now()
    const fileExtension = path.extname(file.originalname)  
    cb(null, uniqueSuffix + fileExtension)
  }
})

const upload = multer({storage: storage})

// sales_transactions
router.post('/sales-transactions',createController.createTransactions)

// sales_orders
router.post('/sales-orders',createController.createOrders)

// sales_orders_details
router.post('/sales-orders-details',createController.createOrdersDetails)

// sales_orders_details_colors
router.post('/sales-orders-details-colors',createController.createDetailsColors)

// sales_orders_details_sizes
router.post('/sales-orders-details-sizes',createController.createDetailsSizes)

// cuttings
router.post('/cuttings',cuttingsController.createCuttings)

// cuttings_molds
router.post('/cuttings-molds',upload.single('cemppImage'),cuttingsController.createMolds)

// cuttings_layers
router.post('/cuttings-layers',cuttingsController.createLayers)

module.exports = router