const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const customersQueries = require('../../dbQueries/data/customersQueries')

const updateController = {
  // sales_orders
  updateOrders: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersQueries.bulkUpdate(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // sales_orders_details
  updateOrdersDetails: async(req,res) =>{
    try{

      const data = req.body

      // update order
      await ordersDetailsQueries.bulkUpdate(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
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
      console.log(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //sales_payments
  updatePayments: async(req,res) =>{
    try{

      const data = req.body

      //update customer
      await paymentsQueries.bulkUpdate(data)
      
      res.json({message: 'ok'}).json()

    }catch(error){
      console.group(error)
      res.json({message: 'error'}).json()
    }
  },
  //sales_payments
  updatePaymentsAssignations: async(req,res) =>{
    try{

      const data = req.body

      console.log(data)

      //update customer
      await paymentsAssignationsQueries.bulkUpdate(data)
      
      res.json({message: 'ok'}).json()

    }catch(error){
      console.group(error)
      res.json({message: 'error'}).json()
    }
  }
}
module.exports = updateController

