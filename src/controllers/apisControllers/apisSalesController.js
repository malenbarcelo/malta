const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const paymentsQueries = require('../../dbQueries/sales/paymentsQueries')
const paymentsAssignationsQueries = require('../../dbQueries/sales/paymentsAssignationsQueries')
const customersQueries = require('../../dbQueries/data/customersQueries')
const paymentMethodsQueries = require('../../dbQueries/data/paymentMethodsQueries')
const accountsMovementsQueries = require('../../dbQueries/sales/accountsMovementsQueries')
const ordersNinoxQueries = require('../../dbQueries/sales/ordersNinoxQueries')
const ordersNinoxDetailsQueries = require('../../dbQueries/sales/ordersNinoxDetailsQueries')
const paymentsNinoxQueries = require('../../dbQueries/sales/paymentsNinoxQueries')
const {updateOrderData,updateOrderStatus,updatePaymentStatus} = require('../../functions/salesFunctions')
const moment = require('moment-timezone')

const apisSalesController = {
  inProgressOrders: async(req,res) =>{
    try{

      const orders = await ordersQueries.inProgressOrders()
      const plainOrders = orders.map(order => order.get({ plain: true }))

      plainOrders.forEach(order => {
        const amountPaid = order.orders_assignations.reduce((sum, oa) => sum +parseFloat(oa.amount,2), 0)
        const balance = parseFloat(order.total) - amountPaid
        order.amountPaid = amountPaid
        order.balance = balance

      })

      res.status(200).json(plainOrders)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  inProgressOrdersShowCanceled: async(req,res) =>{
    try{

      const orders = await ordersQueries.inProgressOrdersShowCanceled()
      const plainOrders = orders.map(order => order.get({ plain: true }))

      plainOrders.forEach(order => {
        const amountPaid = order.orders_assignations.reduce((sum, oa) => sum +parseFloat(oa.amount,2), 0)
        const balance = parseFloat(order.total) - amountPaid
        order.amountPaid = amountPaid
        order.balance = balance

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

      await ordersQueries.createOrder(data)
      orderId = await ordersQueries.lastId()        
      
      //create order details
      await ordersQueries.createOrderDetails(data,orderId)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editOrder: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersQueries.updateOrder(data.id, data)

      //delete order details
      await ordersDetailsQueries.delete(data.id)

      //create order details
      await ordersQueries.createOrderDetails(data,data.id)

      //update order status
      await updateOrderStatus(data.id)
      
      //get order data
      const orderData = await ordersQueries.findOrder(data.id)
      
      //update order total
      const newTotal = await updateOrderData(orderData.id)

      //update payment status      
      const idPaymentsStatus = orderData.id_payments_status
      if (idPaymentsStatus == 4 || idPaymentsStatus == 5) {
        await updatePaymentStatus(orderData.id,idPaymentsStatus,orderData.total,newTotal)
      }

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  addProducts: async(req,res) =>{

    try{

      let data = req.body
      let ordersToCreate = []
      let ordersDetailsToCreate = []

      //get orders to create data
      const newOrderNumber = await ordersQueries.newOrder()
      let orderNumber = newOrderNumber
      for (let i = 0; i < data.length; i++) {
        if (data[i].createOrder == true) {
          const date = new Date()
          date.setHours(date.getHours() - 3)
          ordersToCreate.push({
            date:date,
            order_number:orderNumber,
            id_sales_channels:data[i].id_sales_channels,
            id_customers: data[i].customer.id,
            subtotal:0,
            discount:parseFloat(data[i].customer.discount,2),
            total:0,
            id_orders_status:1,
            id_payments_status:3,
            id_orders_managers:1,
            observations:null,
            enabled:1
          })
          orderNumber += 1
        }
      }

      //create orders if necessary
      if (ordersToCreate.length > 0) {
        for (let i = 0; i < ordersToCreate.length; i++) {
          await ordersQueries.createOrder(ordersToCreate[i])          
        }
      }

      //get order to create details data
      let ordersToUpdate = []      
      let inProgressOrders = await ordersQueries.inProgressOrders()
      inProgressOrders = inProgressOrders.map(ipo => ipo.get({ plain: true }))

      for (let i = 0; i < data.length; i++) {
        
        let customerOrders = inProgressOrders.filter(o => o.id_customers == data[i].customer.id)        
        const orderId = customerOrders.reduce((max, obj) => (obj.id > max.id ? obj : max), customerOrders[0]).id
        
        for (let j = 0; j < data[i].products.length; j++) {

          if (!ordersToUpdate.includes(orderId)) {
            ordersToUpdate.push(orderId)
          }

          ordersDetailsToCreate.push({
            id_orders: orderId,
            id_products:data[i].products[j].id,
            description:data[i].products[j].description,
            color:data[i].products[j].color,
            size:data[i].products[j].size,
            unit_price:data[i].products[j].unit_price,
            required_quantity:null,
            confirmed_quantity:null,
            extended_price:0,
            enabled:1,
            observations:null,
            observations2:null
          })
        }        
      }

      //create orders details
      await ordersDetailsQueries.createOrdersDetails(ordersDetailsToCreate)
      
      //update order_status
      await ordersQueries.updateOrderStatus(ordersToUpdate,1)

      //update payment_status
      for (let i = 0; i < ordersToUpdate.length; i++) {
        const orderData = await ordersQueries.findOrder(ordersToUpdate[i])
        console.log(orderData)
        if (orderData.id_payments_status == 5) {
          await ordersQueries.updatePaymentsStatus(ordersToUpdate[i],4)
        }
      }
      
      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editOrderObs: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersQueries.updateOrderObs(data.id, data.observations)

      res.status(200).json()

    }catch(error){
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editOrderDetailObs: async(req,res) =>{
    try{

      const data = req.body

      //update order detail
      await ordersDetailsQueries.updateOrderDetailObs(data.id, data.observations)

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
      const balanceUsed = req.body.amountPaid.balanceUsed
      const newBalance = req.body.newBalance
      const idPaymentMethod = parseInt(req.body.idPaymentMethod)

      const orderPayment = newBalance < 0 ? (payment + newBalance) : payment
      const notAssignedPayment = -newBalance

      //register payment
      let newPayment
      if (payment > 0) {
        newPayment = await paymentsQueries.registerPayment(idCustomer,payment,idPaymentMethod,'PAGO')
      }

      //register order payment
      if (orderPayment > 0) {
        await paymentsAssignationsQueries.registerAssignation('PAGO ASIGNADO', newPayment.id, idCustomer, idOrder, orderPayment)
      }
      
      //register payment without order if corresponds
      if (notAssignedPayment > 0) {
        await paymentsAssignationsQueries.registerAssignation('PAGO NO ASIGNADO', newPayment.id, idCustomer, null, notAssignedPayment)
      }

      //assign balance used if corresponds
      if (balanceUsed > 0) {
        await paymentsAssignationsQueries.registerAssignation('ASIGNACION', null, idCustomer, idOrder, balanceUsed)
      }

      //update order payment status
      const idPaymentsStatus = (newBalance == 0 || newBalance < 0) ? 5 : 4
      
      await ordersQueries.updatePaymentsStatusById(idOrder,idPaymentsStatus)

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  registerPayment2: async(req,res) =>{
    try{

      const idCustomer = req.body.orderToPay.id_customers
      const payment = req.body.amountPaid.payment
      const newBalance = req.body.newBalance
      const idPaymentMethod = parseInt(req.body.idPaymentMethod)

      //register payment
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
  cancelOrderDetail: async(req,res) =>{
    try{

      const lineDetails = req.body.lineToDelete
      const orderData = req.body.lineToDelete.orders_details_orders
      
      const date = new Date()
      const argDate = moment(date).tz('America/Argentina/Buenos_Aires').format();

      const observations = 'Línea eliminada el ' + argDate

      //unable line
      await ordersDetailsQueries.cancelOrderDetail(lineDetails.id,observations)

      //update order total
      const newTotal = await updateOrderData(orderData.id)
      
      //update order status
      updateOrderStatus(lineDetails.id_orders)

      //update payment status
      const idPaymentsStatus = orderData.id_payments_status
      if (idPaymentsStatus == 4 || idPaymentsStatus == 5 || idPaymentsStatus == 6) {
        updatePaymentStatus(orderData.id,idPaymentsStatus,orderData.total,newTotal)
      }

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  editOrderDetail: async(req,res) =>{
    try{

      const data = req.body
      
      const date = new Date()
      const argDate = moment(date).tz('America/Argentina/Buenos_Aires').format();

      const observations = 'Línea editada el ' + argDate

      //update line
      await ordersDetailsQueries.editOrderDetail(data.lineToEdit.id,data,observations)

      //update order data
      const newTotal = await updateOrderData(data.lineToEdit.id_orders)
      
      //update order status
      updateOrderStatus(data.lineToEdit.id_orders)

      //update payment status
      const idPaymentsStatus = data.lineToEdit.orders_details_orders.id_payments_status
      const total = data.lineToEdit.orders_details_orders.total
      if (idPaymentsStatus == 4 || idPaymentsStatus == 5 || idPaymentsStatus == 6) {
        updatePaymentStatus(data.lineToEdit.id_orders,idPaymentsStatus,total,newTotal)
      }

      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  restoreOrder: async(req,res) =>{
    try{

      const orderId = req.body.idOrder

      await ordersQueries.restoreOrder(orderId)

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
      await ordersNinoxDetailsQueries.cancelOrderDetails(orderId)
      await paymentsNinoxQueries.cancelPayment(orderId)

      res.status(200).json()

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
  setPaymentVerification: async(req,res) => {
    try{

      const orderId = req.body.orderId

      await ordersQueries.setPaymentVerification(orderId)
      
      res.status(200).json()

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

