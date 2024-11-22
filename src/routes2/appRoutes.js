const express = require('express')
const router = express.Router()

//MAIN ROUTES
router.get('/',mainController.login)
router.post('/login',loginValidations.login,mainController.loginProcess)
router.get('/logout',mainController.logoutProcess)
router.get('/main-menu',authMiddleware,mainController.mainMenu)

//SALES
router.get('/in-progress-orders',salesController.inProgressOrders)
router.get('/in-progress-orders/details',salesController.inProgressOrdersDetails)
router.get('/consolidated',salesController.sales)
router.get('/customers',salesController.customers)
router.get('/payment-methods',salesController.paymentMethods)
router.get('/shipping',salesController.shipping)

//CUTTINGS
router.get('/products',productsController.products)
router.get('/data',dataController.data)

module.exports = router