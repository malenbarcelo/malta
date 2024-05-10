
const customersQueries = require('../dbQueries/customersQueries')
const ordersManagersQueries = require('../dbQueries/ordersManagersQueries')

const apisController = {
  customers: async(req,res) =>{
    try{

      const customers = await customersQueries.customers()      

      res.status(200).json(customers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  ordersManagers: async(req,res) =>{
    try{

      const orders_managers = await ordersManagersQueries.ordersManagers()      

      res.status(200).json(orders_managers)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisController

