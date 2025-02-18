const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const ordersDetailsColorsQueries = require('../../dbQueries/sales/ordersDetailsColorsQueries')
const ordersDetailsSizesQueries = require('../../dbQueries/sales/ordersDetailsSizesQueries')

const deleteController = {
  // sales_orders_details
  deleteOrdersDetails: async(req,res) =>{
    try{

      const data = req.body.id_orders

      console.log(data)

      //update order
      await ordersDetailsQueries.delete(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // sales_orders_details_colors
  deleteOrdersDetailsColors: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersDetailsColorsQueries.delete(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // sales_orders_details_sizes
  deleteOrdersDetailsSizes: async(req,res) =>{
    try{

      const data = req.body

      //update order
      await ordersDetailsSizesQueries.delete(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
}
module.exports = deleteController

