const ordersQueries = require("../../dbQueries/sales/ordersQueries")
const customersQueries = require("../../dbQueries/data/customersQueries")

const shippingController = {
    //////APIS//////
    edit: async(req,res) =>{
        try{

          const data = req.body

          //get date and add to data
          // const date = new Date()
          // const dateArg = new Date(date.getTime() - 3 * 60 * 60 * 1000)
          
          //edit orders
          await ordersQueries.update(data.idOrders,data.orders_data)

          //edit customers if applies
          if (data.editMobile) {
            await customersQueries.update(data.mobile_data,data.idCustomers)
          }
          
        
          res.status(200).json()
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = shippingController

