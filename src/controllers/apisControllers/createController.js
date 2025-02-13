
const transactionsQueries = require('../../dbQueries/sales/transactionsQueries')
const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const ordersDetailsColorsQueries = require('../../dbQueries/sales/ordersDetailsColorsQueries')
const ordersDetailsSizesQueries = require('../../dbQueries/sales/ordersDetailsSizesQueries')

const updateController = {
  //sales_transactions
  createTransactions: async(req,res) =>{
    try{

      const data = req.body

      // create transactions
      await transactionsQueries.create(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  //sales_orders
  createOrders: async(req,res) =>{
    try{

      const data = req.body

      // create orders
      const createdData = await ordersQueries.create(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  //sales_orders_details
  createOrdersDetails: async(req,res) =>{
    try{

      const data = req.body

      // create orders details
      const createdData = await ordersDetailsQueries.create(data)
      
      res.json({data:createdData,message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  //sales_orders_details_colors
  createDetailsColors: async(req,res) =>{
    try{

      const data = req.body

      // create orders details colors
      await ordersDetailsColorsQueries.create(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  //sales_orders_details_sizes
  createDetailsSizes: async(req,res) =>{
    try{

      const data = req.body

      // create orders details sizes
      await ordersDetailsSizesQueries.create(data)
      
      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
}
module.exports = updateController

