
const customersQueries = require('../../dbQueries/data/customersQueries')

const getController = {
  //data_customers
  getCustomers: async(req,res) =>{
    try{

      const data = await customersQueries.get()
      
      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  }
}
module.exports = getController

