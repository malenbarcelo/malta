const ordersQueries = require('../dbQueries/sales/ordersQueries')
const paymentsQueries = require('../dbQueries/sales/paymentsQueries')
const customersQueries = require('../dbQueries/data/customersQueries')
const paymentMethodsQueries = require('../dbQueries/data/paymentMethodsQueries')
const accountsMovementsQueries = require('../dbQueries/sales/accountsMovementsQueries')
const ordersNinoxQueries = require('../dbQueries/sales/ordersNinoxQueries')
const data = require('./apisSalesData')

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
  getNinoxSales: async(req,res) => {
    try{

      // const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
      // url.searchParams.append('fecha', '01/03/2024')
      // url.searchParams.append('sucursalId', 1)
      // url.searchParams.append('incluirMediosPago', true)

      // const headers = {
      //   'Content-Type': 'application/json',
      //   'X-NX-TOKEN': 'bl9f6RQBLfq6JDDtFzWZFCtddlxxtIsR'
      // }

      // const response = await fetch(url, {
      //   method: 'GET',
      //   headers: headers
      // })

      // if (!response.ok) {
      //   throw new Error(`HTTP error! Status: ${response.status}`);
      // }
  
      // const data = await response.json()

      //await ninoxOrdersDetailsQueries.saveOrders(data)

      //get data
      const customers = await customersQueries.customers()
      const paymentMethods = await paymentMethodsQueries.paymentMethods()

      //get invoices ids
      const idsInvoices = data.map(data => data.facturaId)
      const idsInvoicesUnique = [...new Set(idsInvoices)]
      const ordersData = []

      //complete data for orders_ninox
      idsInvoicesUnique.forEach(id => {

        const allRows = data.filter(d => d.facturaId == id)
        const date = allRows[0].fechaText
        const customerName = allRows[0].cliente
        const idCustomers = customers.filter(c => c.customer_name == customerName)[0]
        const subtotal = allRows.reduce((sum, row) => sum + (row.precioVentaFinal * row.cantidad), 0)
        const orderNumber = parseInt(allRows[0].numeroFull.split("-")[1])
        
        ordersData.push({
          date:date,
          order_number:orderNumber,
          sales_channel:1,
          id_customers: idCustomers ? idCustomers.id : null,
          subtotal: subtotal,
          discount:0,
          total:subtotal,
          id_orders_status:3,
          id_payments_status:5,
          id_orders_managers:1,
          obervations:'',
          enabled:1
        })        
      })

      //save data in orders_ninox
      await ordersNinoxQueries.saveOrders(ordersData)

      return res.send(ordersData)

      //res.status(200).json(data)

    }catch(error){

        console.log(error)
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

}
module.exports = apisSalesController

