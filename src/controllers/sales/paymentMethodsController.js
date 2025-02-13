const paymentMethodsQueries = require("../../dbQueries/data/paymentMethodsQueries")

const paymentMethodsController = {
    //////APIS//////
    paymentMethods: async(req,res) =>{
      try{

        const paymenMethods = await paymentMethodsQueries.paymentMethods()
      
        res.status(200).json(paymenMethods)
      
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
    createPaymentMethod: async(req,res) =>{
        try{

          const data = req.body

          //create customer
          await paymentMethodsQueries.create(data)
        
            res.status(200).json()
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    editPaymentMethod: async(req,res) =>{
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
    deletePaymentMethod: async(req,res) =>{
      try{

        const id = req.body.id

        //edit payment method
        await paymentMethodsQueries.destroy(id)
      
          res.status(200).json()
      
      }catch(error){
        console.log(error)
        return res.send('Ha ocurrido un error')
      }
    },
      
}

module.exports = paymentMethodsController

