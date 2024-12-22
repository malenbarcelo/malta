const dominio = require("../dominio")
const ordersWpQueries = require("../../dbQueries/sales/ordersWpQueries")

const ordersController = {
    //////APIS//////
    inProgressOrdersShowCanceled: async(req,res) =>{
      try{
  
        const orders = await ordersWpQueries.inProgressOrdersShowCanceled()
        const plainOrders = orders.map(order => order.get({ plain: true }))
  
        plainOrders.forEach(order => {
          // const amountPaid = order.orders_assignations.reduce((sum, oa) => sum +parseFloat(oa.amount,2), 0)
          // const balance = parseFloat(order.total) - amountPaid
          // order.amountPaid = amountPaid
          // order.balance = balance
          order.amountPaid = 0
          order.balance = order.total
        })
  
        res.status(200).json(plainOrders)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
}

module.exports = ordersController

