const customersQueries = require("../../dbQueries/data/customersQueries")

const customersController = {
    //////APIS//////
    createCustomer: async(req,res) =>{
        try{

          const data = req.body

          //create customer
          await customersQueries.create(data)
        
            res.status(200).json()
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    editCustomer: async(req,res) =>{
      try{

        const id = req.body.id
        const newData = req.body.newData

        //edit customer
        await customersQueries.update(newData,id)
      
          res.status(200).json()
      
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
    deleteCustomer: async(req,res) =>{
      try{

        const id = req.body.id

        //edit customer
        await customersQueries.destroy(id)
      
          res.status(200).json()
      
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
    
}

module.exports = customersController

