
const customersQueries = require('../../dbQueries/data/customersQueries')
const salesChannelsQueries = require('../../dbQueries/data/salesChannelsQueries')
const productsQueries = require('../../dbQueries/cuttings/productsQueries')
const ordersManagersQueries = require('../../dbQueries/data/ordersManagersQueries')
const ordersWpQueries = require('../../dbQueries/sales/ordersWpQueries')

const apisDataController = {
  customers: async(req,res) =>{
    try{

      const customers = await customersQueries.customers()

      res.status(200).json(customers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  salesChannels: async(req,res) =>{
    try{

      const salesChannels = await salesChannelsQueries.salesChannels()

      res.status(200).json(salesChannels)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  products: async(req,res) =>{
    try{

      const products = await productsQueries.products()

      res.status(200).json(products)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  ordersManagers: async(req,res) =>{
    try{

      const ordersManagers = await ordersManagersQueries.ordersManagers()

      res.status(200).json(ordersManagers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictCustomers: async(req,res) =>{
    try{
      const string = req.params.string.toLowerCase()

      let customers = await customersQueries.getDistinct()

      const predictedCustomers = customers.filter(c => c.customer_name.toLowerCase().includes(string))

      res.status(200).json(predictedCustomers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictCustomersWeb: async(req,res) =>{
    try{
      const string = req.params.string.toLowerCase()

      const customers = await ordersWpQueries.customers()

      const predictedCustomers = customers.filter(c => c.customer.toLowerCase().includes(string))

      res.status(200).json(predictedCustomers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisDataController

