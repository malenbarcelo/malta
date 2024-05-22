
const ordersQueries = require('../dbQueries/ordersQueries')

const apisSalesController = {
  orders: async(req,res) =>{
    try{

      const orders = await ordersQueries.orders()

      res.status(200).json(orders)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  newOrder: async(req,res) =>{
    try{

      salesChannel = req.params.salesChannel

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
}
module.exports = apisSalesController

