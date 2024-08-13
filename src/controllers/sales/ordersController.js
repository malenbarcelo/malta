const paymentsAssignationsQueries = require("../dbQueries/sales/paymentsAssignationsQueries")

const ordersController = {
    //////APIS//////
    customerAssignations: async(req,res) =>{
        try{

            const idCustomer = req.params.idCustomer

            //get date from
            let dateFrom = new Date()
            dateFrom.setMonth(dateFrom.getMonth() - 12)
            dateFrom.setHours(0, 0, 0, 0)
        
            const customersAssignations = await paymentsAssignationsQueries.customerAssignations(dateFrom)

            let notAssigned = customersAssignations.filter( ca => ca.id_customers == idCustomer && ca.type == 'PAGO NO ASIGNADO')
            notAssigned = notAssigned.length == 0 ? 0 : notAssigned[0].total_amount
            let assignations = customersAssignations.filter( ca => ca.id_customers == idCustomer && ca.type == 'ASIGNACION')
            assignations = assignations.length == 0 ? 0 : assignations[0].total_amount
            let returns = customersAssignations.filter( ca => ca.id_customers == idCustomer && ca.type == 'DEVOLUCION')
            returns = returns.length == 0 ? 0 : returns[0].total_amount
            const positiveBalance = parseFloat(notAssigned,2) - parseFloat(assignations) - parseFloat(returns)
        
            res.status(200).json(positiveBalance)
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
      },
}

module.exports = ordersController

