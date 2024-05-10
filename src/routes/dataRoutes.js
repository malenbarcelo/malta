const express = require('express')
const dataController = require('../controllers/dataController.js')
const router = express.Router()

router.get('/sales',dataController.sales)
router.get('/sales/customers',dataController.customers)
/*router.get('/cuttings',dataController.cuttings)
router.get('/finances',dataController.finances)*/


module.exports = router

