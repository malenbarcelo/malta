const ordersQueries = require('../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../dbQueries/sales/ordersDetailsQueries')
const paymentsQueries = require('../dbQueries/sales/paymentsQueries')
const customersQueries = require('../dbQueries/data/customersQueries')
const paymentMethodsQueries = require('../dbQueries/data/paymentMethodsQueries')
const accountsMovementsQueries = require('../dbQueries/sales/accountsMovementsQueries')
const ordersNinoxQueries = require('../dbQueries/sales/ordersNinoxQueries')
const ordersNinoxDetailsQueries = require('../dbQueries/sales/ordersNinoxDetailsQueries')
const paymentsNinoxQueries = require('../dbQueries/sales/paymentsNinoxQueries')

const apisSalesController = {
  inProgressOrders: async(req,res) =>{
    try{

      const orders = await ordersQueries.inProgressOrders()
      const plainOrders = orders.map(order => order.get({ plain: true }))

      plainOrders.forEach(order => {
        let payments = 0
        let accountMovements = 0
        order.orders_payments.forEach(payment => {
          payments += parseFloat(payment.amount,2)
        })
        order.orders_accounts_movements.forEach(movement => {
          accountMovements += parseFloat(movement.amount,2)
        })
        order.payments = payments
        order.accountMovements = accountMovements
        order.amountPaid = payments + accountMovements
        order.balance = order.total - (payments + accountMovements)
      })

      res.status(200).json(plainOrders)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  inProgressOrdersDetails: async(req,res) =>{
    try{

      const ordersDetails = await ordersDetailsQueries.inProgressOrdersDetails()

      res.status(200).json(ordersDetails)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  newOrder: async(req,res) =>{
    try{
      
      const newOrderNumber = await ordersQueries.newOrder()

      res.status(200).json(newOrderNumber)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  saveOrder: async(req,res) =>{
    try{

      const data = req.body
      var orderId = 0

      //get order id if exists
      const getOrder = await ordersQueries.filterOrder(data.order_number)

      //update order if exists, else create order
      if (getOrder != null) {
        orderId = getOrder.id
        //await ordersQueries.editOrder(data, orderId)
        //await ordersQueries.deleteOrderDetails(orderId)
      }else{
        await ordersQueries.createOrder(data)
        orderId = await ordersQueries.lastId()        
      }

      //create order details
      await ordersQueries.createOrderDetails(data,orderId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  inProgressOrdersPayments: async(req,res) =>{
    try{

      const inProgressOrders = await ordersQueries.inProgressOrders()

      const ordersIds = inProgressOrders.map(o => o.id) 

      const ordersPayments = await paymentsQueries.inProgressOrdersPayments(ordersIds)

      res.status(200).json(ordersPayments)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  registerPayment: async(req,res) =>{
    try{

      const idOrder = req.body.orderToPay.id
      const idCustomer = req.body.orderToPay.id_customers
      const payment = req.body.amountPaid.payment
      const newBalance = req.body.newBalance
      const idPaymentMethod = req.body.idPaymentMethod

      const orderPayment = newBalance < 0 ? (payment + newBalance) : payment
      const accountPayment = -newBalance

      //register order payment
      if (orderPayment > 0) {
        await paymentsQueries.registerOrderPayment(idOrder,idCustomer,orderPayment,idPaymentMethod)
      }      

      //register payment without order if corresponds
      if (accountPayment > 0) {
        await paymentsQueries.registerAccountPayment(idCustomer,accountPayment,idPaymentMethod)
      }

      //update order payment status
      await ordersQueries.updatePaymentsStatus(idOrder)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  registerAccountMovement: async(req,res) =>{
    try{

      const idOrder = req.body.orderToPay.id
      const idCustomer = req.body.orderToPay.id_customers
      const balanceUsed = req.body.amountPaid.balanceUsed

      await accountsMovementsQueries.registerMovement(idOrder,idCustomer,balanceUsed)

      //update order payment status
      await ordersQueries.updatePaymentsStatus(idOrder)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  deliverOrder: async(req,res) =>{
    try{

      const orderId = req.body.idOrder

      await ordersQueries.deliverOrder(orderId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  assignOrderManager: async(req,res) =>{
    try{

      const orderId = req.body.idOrder
      const orderManagerId = req.body.orderManagerId

      await ordersQueries.assignOrderManager(orderId,orderManagerId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  cancelOrder: async(req,res) =>{
    try{

      const orderId = req.body.idOrder

      await ordersQueries.cancelOrder(orderId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  cancelOrderNinox: async(req,res) =>{
    try{

      const orderId = req.body.idSale

      await ordersNinoxQueries.cancelOrder(orderId)
      await ordersDetailsNinoxQueries.cancelOrderDetails(orderId)
      await ordersNinoxQueries.cancelPayment(orderId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  customerPositiveBalance: async(req,res) =>{
    try{

      const idCustomer = req.params.idCustomer
      let netBalance = 0

      const positiveBalance = await paymentsQueries.positiveBalance(idCustomer)
      const positiveBalanceUsed = await accountsMovementsQueries.positiveBalanceUsed(idCustomer)

      if (positiveBalance) {
        netBalance = netBalance + parseFloat(positiveBalance.total_amount,2)
      }

      if (positiveBalanceUsed) {
        netBalance = netBalance - parseFloat(positiveBalanceUsed.total_amount,2)
      }

      res.status(200).json(netBalance)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  consolidatedSales: async(req,res) => {
    try{

      const year = req.params.year
      const iDate = new Date(year + '-01-01') 
      const fDate = new Date(year + '-12-31')

      const webAndDifSales = await ordersQueries.webAndDifSales(iDate,fDate)
      const ninoxSales = await ordersNinoxQueries.ninoxSales(iDate,fDate)

      let sales = webAndDifSales.concat(ninoxSales);

      res.status(200).json(sales)

    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
  },
  deleteProduct: async(req,res) => {
    try{

      const year = req.params.year
      const iDate = new Date(year + '-01-01') 
      const fDate = new Date(year + '-12-31')

      const webAndDifSales = await ordersQueries.webAndDifSales(iDate,fDate)
      const ninoxSales = await ordersNinoxQueries.ninoxSales(iDate,fDate)

      let sales = webAndDifSales.concat(ninoxSales);

      res.status(200).json(sales)

    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
  },
  updatePaymentStatus: async(req,res) => {
    try{

      const year = req.params.year
      const iDate = new Date(year + '-01-01') 
      const fDate = new Date(year + '-12-31')

      const webAndDifSales = await ordersQueries.webAndDifSales(iDate,fDate)
      const ninoxSales = await ordersNinoxQueries.ninoxSales(iDate,fDate)

      let sales = webAndDifSales.concat(ninoxSales);

      res.status(200).json(sales)

    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
  },
  predictSalesNumbers: async(req,res) =>{
    try{
      const string = req.params.string.toLowerCase()

      const salesNumbers = await ordersQueries.salesNumbers()

      const predictedSalesNumbers = salesNumbers.filter(sn => sn.order_number.toLowerCase().includes(string))

      res.status(200).json(predictedSalesNumbers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },


}
module.exports = apisSalesController

