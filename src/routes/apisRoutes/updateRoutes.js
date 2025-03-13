const express = require('express')
const multer = require('multer')
const path = require('path')
const updateController = require('../../controllers/apisControllers/updateController.js')
const cuttingsController = require('../../controllers/apisControllers/updateControllers/cuttingsController.js')
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

// sales_orders
router.post('/sales-orders',updateController.updateOrders)

// sales_orders_details
router.post('/sales-orders-details',updateController.updateOrdersDetails)

// sales_payments
router.post('/sales-payments',updateController.updatePayments)

// sales_payments_assignations
router.post('/sales-payments-assignations',updateController.updatePaymentsAssignations)

// data_customers
router.post('/data-customers',updateController.updateCustomers)

// cuttings_molds
router.post('/cuttings-molds',upload.single('cemppImage'),cuttingsController.updateMolds)

module.exports = router