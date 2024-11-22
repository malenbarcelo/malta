const shippingMethodsQueries = require("../../dbQueries/data/shippingMethodsQueries")

const shippingMethodsController = {
    //////APIS//////
    getData: async(req,res) =>{
      try{

        const data = await shippingMethodsQueries.getData()
      
        res.status(200).json(data)
      
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
    create: async(req,res) =>{
        try{

          const data = req.body

          //create customer
          await shippingMethodsQueries.create(data)
        
            res.status(200).json()
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = shippingMethodsController

