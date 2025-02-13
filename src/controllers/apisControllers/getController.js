const transactionsQueries = require('../../dbQueries/sales/transactionsQueries')
const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const customersQueries = require('../../dbQueries/data/customersQueries')
const productsQueries = require('../../dbQueries/cuttings/productsQueries')
const seasonsQueries = require('../../dbQueries/main/seasonsQueries')

const getController = {
  //seasons
  getSeasons: async(req,res) =>{
    try{

      const data = await seasonsQueries.get()
      
      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //data_customers
  getCustomers: async(req,res) =>{
    try{

      const data = await customersQueries.get()
      
      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //cuttings_products
  getProducts: async(req,res) =>{
    try{

      const { page, size, season, product_code } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      //add filters
      if (product_code) {
          filters.product_code = product_code
      }
      if (season) {
        filters.season = season
      }

      //get data
      const data = await productsQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //sales_transactions
  getTransactions: async(req,res) =>{
    try{
      const { page, size, date_from, id_customers, id_orders } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      //add filters
      if (date_from) {
          filters.date_from = date_from
      }

      if (id_customers) {
        filters.id_customers = id_customers
      }

      if (id_orders) {
        filters.id_orders = id_orders
      }

      //get data
      const data = await transactionsQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //sales_orders
  getOrders: async(req,res) =>{
    try{
      const { page, size, date_from, id_customers } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      //add filters
      if (date_from) {
          filters.date_from = date_from
      }

      if (id_customers) {
        filters.id_customers = id_customers
      }

      //get data
      const data = await ordersQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  //sales_orders_details
  getOrdersDetails: async(req,res) =>{
    try{
      const { page, size, id_orders } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      //add filters
      if (id_orders) {
          filters.id_orders = id_orders
      }

      //get data
      const data = await ordersDetailsQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },

}
module.exports = getController

