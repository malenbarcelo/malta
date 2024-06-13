
const customersQueries = require('../dbQueries/customersQueries')
const productsQueries = require('../dbQueries/productsQueries')

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
  products: async(req,res) =>{
    try{

      const products = await productsQueries.products()

      res.status(200).json(products)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  predictProducts: async(req,res) =>{
    try{
      const string = req.params.string.toLowerCase()

      const products = await productsQueries.distinctProducts()

      const predictedProducts = products.filter(p => p.description.toLowerCase().includes(string))

      res.status(200).json(predictedProducts)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisDataController

