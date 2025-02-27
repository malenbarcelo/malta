const transactionsQueries = require('../../dbQueries/sales/transactionsQueries')
const ordersQueries = require('../../dbQueries/sales/ordersQueries')
const ordersDetailsQueries = require('../../dbQueries/sales/ordersDetailsQueries')
const ordersDetailsColorsQueries = require('../../dbQueries/sales/ordersDetailsColorsQueries')
const ordersDetailsSizesQueries = require('../../dbQueries/sales/ordersDetailsSizesQueries')
const customersQueries = require('../../dbQueries/data/customersQueries')
const productsQueries = require('../../dbQueries/cuttings/productsQueries')
const usersQueries = require('../../dbQueries/users/usersQueries')
const productsColorsQueries = require('../../dbQueries/cuttings/productsColorsQueries')
const productsSizesQueries = require('../../dbQueries/cuttings/productsSizesQueries')
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
  //users
  getUsers: async(req,res) =>{
    try{

      const data = await usersQueries.get()
      
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
      const { page, size, order, id_orders, order_number, customer_name, description, id_sales_channels, id_orders_status, item_status } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      //add filters
      if (id_orders) {
          filters.id_orders = id_orders
      }
      if (order_number) {
        filters.order_number = order_number
      }
      if (customer_name) {
        filters.customer_name = customer_name
      }
      if (description) {
        filters.description = description
      }
      if (id_sales_channels) {
        filters.id_sales_channels = id_sales_channels
      }
      if (id_orders_status) {
        filters.id_orders_status = id_orders_status
      }
      if (item_status) {
        filters.item_status = item_status
      }

      if (order) {
        filters.order = JSON.parse(order)
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
  // cuttings_products_colors
  getProductsColors: async(req,res) =>{
    try{
      const { id_products } = req.query
      const filters = {}
            
      //add filters
      if (id_products) {
          filters.id_products = id_products
      }

      //get data
      const data = await productsColorsQueries.get({ filters })

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // cuttings_products_sizes
  getProductsSizes: async(req,res) =>{
    try{
      const { id_products } = req.query
      const filters = {}
            
      //add filters
      if (id_products) {
          filters.id_products = id_products
      }

      //get data
      const data = await productsSizesQueries.get({ filters })

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // sales_orders_details_colors
  getOrdersDetailsColors: async(req,res) =>{
    try{
      const { id_orders_details } = req.query
      const filters = {}
            
      //add filters
      if (id_orders_details) {
          filters.id_orders_details = id_orders_details
      }

      //get data
      const data = await ordersDetailsColorsQueries.get({ filters })

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // sales_orders_details_sizes
  getOrdersDetailsSizes: async(req,res) =>{
    try{
      const { id_orders_details } = req.query
      const filters = {}
            
      //add filters
      if (id_orders_details) {
          filters.id_orders_details = id_orders_details
      }

      //get data
      const data = await ordersDetailsSizesQueries.get({ filters })

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },

}
module.exports = getController

