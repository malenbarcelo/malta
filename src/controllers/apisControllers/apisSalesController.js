
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
  getNinoxSales: async(req,res) => {
    try{

      //const { anio, mes, sucursalId, incluirMediosPago } = req.query

      const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
      url.searchParams.append('anio', 2024)
      url.searchParams.append('mes', 6)
      url.searchParams.append('sucursalId', 1)
      url.searchParams.append('incluirMediosPago', true)

      const headers = {
        'Content-Type': 'application/json',
        'X-NX-TOKEN': 'bl9f6RQBLfq6JDDtFzWZFCtddlxxtIsR'
      }

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      })

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json()

      res.status(200).json(data)


    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
},
}
module.exports = apisSalesController

