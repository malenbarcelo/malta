const express = require('express')
const productsController = require('../controllers/cuttings/productsController.js')
const dataController = require('../controllers/cuttings/dataController.js')
const router = express.Router()

//---BACKEND---//
router.get('/products',productsController.products)
router.get('/data',dataController.data)

//---APIS---//
/*data*/
router.get('/data/products-types',dataController.productsTypes)
router.get('/data/predict-products-types/:string',dataController.predictProductsTypes)
router.get('/data/fabrics',dataController.fabrics)
router.get('/data/predict-fabrics/:string',dataController.predictFabrics)
router.get('/data/colors',dataController.colors)
router.get('/data/sizes',dataController.sizes)
router.post('/data/delete-data',dataController.deleteData)
router.post('/data/create-data',dataController.createData)

/*products*/
router.post('/products/create-product',productsController.createProduct)
router.post('/products/edit-product',productsController.editProduct)
router.get('/products/season-products/:season',productsController.seasonProducts)
router.get('/products/predict-season-descriptions/:season/:string',productsController.predictSeasonDescriptions)
router.get('/products/predict-season-products/:season/:string',productsController.predictSeasonProducts)



module.exports = router
