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
            const customersData = await customersQueries.customers()

            //in progress orders
            let inProgressOrders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()

            //customers payments whitout assigned order (last year)
            const customersNullPayments = await paymentsQueries.customersNullPayments(dateFrom)

            //customers accounts movements (last year)
            const customersAccountsMovements = await accountsMovementsQueries.customersMovements(dateFrom)

            customersData.forEach(c => {
                const ordersBalance = inProgressOrders
                    .filter(item => item.id_customers == c.id)
                    .reduce((acc, item) => acc + item.balance, 0)

                let nullPayments = customersNullPayments.filter(cnp => cnp.id_customers == c.id )
                nullPayments = nullPayments.length > 0 ? nullPayments[0].total_amount : 0
                
                let assignments = customersAccountsMovements.filter(cam => cam.id_customers == c.id )
                assignments = assignments.length > 0 ? assignments[0].total_amount : 0
                
                c.ordersBalance = ordersBalance
                c.notAssignedBalance = nullPayments - assignments
                
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

