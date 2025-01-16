
const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const customersQueries = require('../../dbQueries/data/customersQueries')

const updateController = {
  //sales_orders
  updateSalesOrders: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersQueries.bulkUpdate(data)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //data_customers
  updateCustomers: async(req,res) =>{
    try{

      const data = req.body

      //update customer
      await customersQueries.bulkUpdate(data)
      
      res.status(200).json()

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  }
}
module.exports = updateController

