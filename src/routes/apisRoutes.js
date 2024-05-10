const express = require('express')
const apisController = require('../controllers/apisControllers/apisDataController.js')
const router = express.Router()

router.get('/customers',apisController.customers)
router.get('/orders-managers',apisController.ordersManagers)


module.exports = router