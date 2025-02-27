const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const transactionsQueries = require('../../dbQueries/sales/transactionsQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const ordersDetailsColorsQueries = require('../../dbQueries/sales/ordersDetailsColorsQueries')
const ordersDetailsSizesQueries = require('../../dbQueries/sales/ordersDetailsSizesQueries')
const accountsMovementsQueries = require('../../dbQueries/sales/accountsMovementsQueries')
const ordersNinoxQueries = require('../../dbQueries/sales/ordersNinoxQueries')
const ordersNinoxDetailsQueries = require('../../dbQueries/sales/ordersNinoxDetailsQueries')
const paymentsNinoxQueries = require('../../dbQueries/sales/paymentsNinoxQueries')
const {updateOrderData,updateOrderStatus,updatePaymentStatus} = require('../../functions/salesFunctions')
const moment = require('moment-timezone')
const sequelize = require('sequelize')

const apisSalesController = {
  inProgressOrders: async(req,res) =>{
    try{

      const date1 = Date.now()

      const orders = await ordersQueries.inProgressOrders()
      const plainOrders = orders.map(order => order.get({ plain: true }))

      plainOrders.forEach(order => {
        const amountPaid = order.orders_assignations.reduce((sum, oa) => sum +parseFloat(oa.amount,2), 0)
        const balance = parseFloat(order.total) - amountPaid
        order.amountPaid = amountPaid
        order.balance = balance

      })

      const date2 = Date.now()

      console.log(date2-date1)

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

      for (const o of plainOrders){
        const amountPaid = await transactionsQueries.sumTransactions(o.id)
        const balance = parseFloat(o.total) - amountPaid
        o.amountPaid = amountPaid == null ? 0 : amountPaid
        o.balance = balance
      }

      res.status(200).json(plainOrders)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  inProgressOrdersDetails: async(req,res) =>{
    try{

      const date1 = Date.now()

      const ordersDetails = await ordersDetailsQueries.inProgressOrdersDetails()

      const date2 = Date.now()

      console.log('tiempo: ' + (date2-date1))


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
  createOrder: async(req,res) =>{
    try{

      const data = req.body
      const userLogged = req.session.userLogged
      data.id_users = userLogged.id
      
      //create order
      const newOrder = await ordersQueries.createOrder(data)
      const orderId = newOrder.id      
      
      //create order details
      for (let i = 0; i < data.order_details.length; i++) {
        const newDetail = await ordersDetailsQueries.createOrderDetail(data.order_details[i],orderId)
        //create orders details colors
        const colors = data.order_details[i].colors.map(obj => ({
          id_orders_details: newDetail.id,
          id_colors: obj.id_colors
        }))
        await ordersDetailsColorsQueries.create(colors)

        //create orders details sizes
        const sizes = data.order_details[i].sizes.map(obj => ({
          id_orders_details: newDetail.id,
          id_sizes: obj.id_sizes
        }))
        await ordersDetailsSizesQueries.create(sizes)        
      }      

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

      //get orders details ids
      const orderDetails = await ordersDetailsQueries.findOrderDetails(data.id)
      const orderDetailsIds = orderDetails.map(od => od.id)

      //delete colors
      await ordersDetailsColorsQueries.delete(orderDetailsIds)

      //delete sizes
      await ordersDetailsSizesQueries.delete(orderDetailsIds)

      //delete order details
      await ordersDetailsQueries.delete(data.id)

      //create order details
      for (let i = 0; i < data.order_details.length; i++) {
        const newDetail = await ordersDetailsQueries.createOrderDetail(data.order_details[i],data.id)
        
        //create orders details colors
        const colors = data.order_details[i].colors.map(obj => ({
          id_orders_details: newDetail.id,
          id_colors: obj.id_colors
        }))
        await ordersDetailsColorsQueries.create(colors)

        //create orders details sizes
        const sizes = data.order_details[i].sizes.map(obj => ({
          id_orders_details: newDetail.id,
          id_sizes: obj.id_sizes
        }))
        await ordersDetailsSizesQueries.create(sizes)        
      }      

      //update order status
      //await updateOrderStatus(data.id)
      
      // //get order data
      // const orderData = await ordersQueries.findOrder(data.id)
      
      // //update order total
      // const newTotal = await updateOrderData(orderData.id)

      // //update payment status      
      // const idPaymentsStatus = orderData.id_payments_status
      // if (idPaymentsStatus == 4 || idPaymentsStatus == 5) {
      //   await updatePaymentStatus(orderData.id,idPaymentsStatus,orderData.total,newTotal)
      // }

      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  addProducts: async(req,res) =>{
    try{

      let data = req.body
      let ordersToCreate = []
      const userLogged = req.session.userLogged
      const orderManager = await ordersManagersQueries.findOrderManager(userLogged.id)
      
      //get orders to create data
      const newOrderNumber = await ordersQueries.newOrder()
      let orderNumber = newOrderNumber
      for (let i = 0; i < data.length; i++) {
        if (data[i].createOrder == true) {
          if (ordersToCreate.filter(o => o.id_customers == data[i].customer.id).length == 0) {
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
            id_orders_managers:orderManager.length > 0 ? orderManager[0].id : 1,
            observations:null,
            season:data[i].season,
            enabled:1
          })
          orderNumber += 1
          }
        }
      }

      //create orders if necessary and get new orders data
      let orders = []

      let newOrders = []
      if (ordersToCreate.length > 0) {
        newOrders = await ordersQueries.createOrders(ordersToCreate)
        newOrders = newOrders.map(no => no.get({ plain: true }))
        newOrders = newOrders.map(no => ({ id: no.id, id_customers: no.id_customers }))
        newOrders.forEach(no => {
          orders.push(no)
        })        
      }
      
      //get oldOrders data
      let oldOrders = data.filter(d => d.createOrder == false)
      let inProgressOrders = await ordersQueries.inProgressOrders()
      inProgressOrders = inProgressOrders.map(ipo => ipo.get({ plain: true }))
      oldOrders.forEach(oo => {
        let customerOrders = inProgressOrders.filter(o => o.id_customers == oo.customer.id)
        const orderId = customerOrders.reduce((max, obj) => (obj.id > max.id ? obj : max), customerOrders[0]).id
        if (orders.filter(o => o.id == orderId).length == 0) {
          orders.push({id:orderId,id_customers:oo.customer.id})
        }
      })

      //complete orders details to create
      let ordersDetailsToCreate = []
      orders.forEach(o => {
        o.details = []
        const detailsToCreate = data.filter( d => d.customer.id == o.id_customers)
        detailsToCreate.forEach(d => {
          d.products.forEach(p => {
            ordersDetailsToCreate.push({
              id_orders: o.id,
              id_products: p.id, 
              description: p.full_description, 
              unit_price: parseFloat(p.unit_price,2),
              extended_price: 0,
              enabled:1
            })
          })
        })
      })

      //create orders details
      await ordersDetailsQueries.createOrdersDetails(ordersDetailsToCreate)
      
      //update order_status
      const ordersIds = orders.map(o => (o.id))
      await ordersQueries.updateOrderStatus(ordersIds,1)

      //update payment_status
      for (let i = 0; i < ordersIds.length; i++) {
        const orderData = await ordersQueries.findOrder(ordersIds[i])
        if (orderData.id_payments_status == 5) {
          await ordersQueries.updatePaymentsStatusById(ordersIds[i],4)
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
      let date = new Date(req.body.date)
      date = date.setHours(date.getHours() + 3)

      const orderPayment = newBalance < 0 ? (payment + newBalance) : payment
      const notAssignedPayment = -newBalance

      //register payment
      let newPayment
      if (payment > 0) {
        newPayment = await paymentsQueries.registerPayment(idCustomer,payment,idPaymentMethod,'PAGO ASIGNADO',date)
      }

      //register order payment
      if (orderPayment > 0) {
        await paymentsAssignationsQueries.registerAssignation('PAGO ASIGNADO', newPayment.id, idCustomer, idOrder, orderPayment,date)
      }
      
      //register payment without order if corresponds
      if (notAssignedPayment > 0) {
        await paymentsAssignationsQueries.registerAssignation('PAGO NO ASIGNADO', newPayment.id, idCustomer, null, notAssignedPayment,date)
      }

      //assign balance used if corresponds
      if (balanceUsed > 0) {
        await paymentsAssignationsQueries.registerAssignation('ASIGNACION', null, idCustomer, idOrder, balanceUsed,date)
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
      const date = new Date()
      date.setHours(date.getHours() - 3) //Arg time

      await ordersQueries.deliverOrder(orderId, date)

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

      //delete and create colors
      if (JSON.stringify(data.colors) != JSON.stringify(data.lineToEdit.colors)) {
        const colorsToCreate = data.colors.map(({ id, ...rest }) => rest)
        await ordersDetailsColorsQueries.delete([data.lineToEdit.id])
        await ordersDetailsColorsQueries.create(colorsToCreate)
      }

      //delete and create sizes
      if (JSON.stringify(data.sizes) != JSON.stringify(data.lineToEdit.sizes)) {
        const sizesToCreate = data.sizes.map(({ id, ...rest }) => rest)
        await ordersDetailsSizesQueries.delete([data.lineToEdit.id])
        await ordersDetailsSizesQueries.create(sizesToCreate)
      }

      // //update order data
      // const newTotal = await updateOrderData(data.lineToEdit.id_orders)
      
      // //update order status
      // updateOrderStatus(data.lineToEdit.id_orders)

      // //update payment status
      // const idPaymentsStatus = data.lineToEdit.orders_details_orders.id_payments_status
      // const total = data.lineToEdit.orders_details_orders.total
      // if (idPaymentsStatus == 4 || idPaymentsStatus == 5 || idPaymentsStatus == 6) {
      //   updatePaymentStatus(data.lineToEdit.id_orders,idPaymentsStatus,total,newTotal)
      // }

      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
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

