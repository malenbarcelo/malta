const express = require('express')
const productsController = require('../controllers/cuttings/productsController.js')
const dataController = require('../controllers/cuttings/dataController.js')
const router = express.Router()

//---BACKEND---//
router.get('/products',productsController.products)
router.get('/data',dataController.data)

//---APIS---//
router.get('/data/products-types',dataController.productsTypes)
router.get('/data/fabrics',dataController.fabrics)
router.get('/data/colors',dataController.colors)
router.get('/data/sizes',dataController.sizes)
router.post('/data/delete-data',dataController.deleteData)

module.exports = router
