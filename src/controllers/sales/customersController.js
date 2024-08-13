const bottomHeaderMenu = require("./bottomHeaderMenu")
const dominio = require("../dominio")
const ordersQueries = require("../dbQueries/sales/ordersQueries")
const customersQueries = require("../dbQueries/data/customersQueries")
const paymentsQueries = require("../dbQueries/sales/paymentsQueries")
const accountsMovementsQueries = require("../dbQueries/sales/accountsMovementsQueries")

const customersController = {
    customers: (req,res) => {
        try{
            const selectedItem = 'CLIENTES'
            return res.render('sales/customers/customers',{title:'Clientes',bottomHeaderMenu,selectedItem})
        }catch(error){
            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    //////APIS//////
    customersSummary: async(req,res) =>{
        try{
            //get date from
            let dateFrom = new Date()
            dateFrom.setMonth(dateFrom.getMonth() - 12)
            dateFrom.setHours(0, 0, 0, 0)

            //get customers
            let customersData = await customersQueries.customers(dateFrom)
            customersData = customersData.map(cd => cd.get({ plain: true }))

            //in progress orders
            let inProgressOrders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()

            //complete customers data
            customersData.forEach(c => {
                
                const ordersBalance = inProgressOrders
                     .filter(o => o.id_customers == c.id)
                     .reduce((acc, o) => acc + o.balance, 0)

                const notAssignedPayments = c.customers_payments_assignations
                     .filter(cpa => cpa.type == 'PAGO NO ASIGNADO')
                     .reduce((acc, cpa) => acc + parseFloat(cpa.amount,2), 0)

                const assignments = c.customers_payments_assignations
                     .filter(cpa => cpa.type == 'ASIGNACION')
                     .reduce((acc, cpa) => acc + parseFloat(cpa.amount,2), 0)

                const returns = c.customers_payments_assignations
                     .filter(cpa => cpa.type == 'DEVOLUCION')
                     .reduce((acc, cpa) => acc + parseFloat(cpa.amount,2), 0)
                
                c.ordersBalance = ordersBalance
                c.positiveBalance = notAssignedPayments - assignments - returns
            })

            customersData.sort((a, b) => b.ordersBalance - a.ordersBalance)

            res.status(200).json(customersData)
    
        }catch(error){
          console.group(error)
          return res.send('Ha ocurrido un error')
        }
      },
}

module.exports = customersController

