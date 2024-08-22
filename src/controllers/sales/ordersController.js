const dominio = require("../dominio")
const ordersQueries = require("../dbQueries/sales/ordersQueries")
const paymentsQueries = require("../dbQueries/sales/paymentsQueries")
const paymentsAssignationsQueries = require("../dbQueries/sales/paymentsAssignationsQueries")
const customersQueries = require("../dbQueries/data/customersQueries")

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
            let returns = customersAssignations.filter( ca => ca.id_customers == idCustomer && ca.type == 'REINTEGRO')
            returns = returns.length == 0 ? 0 : returns[0].total_amount
            const positiveBalance = parseFloat(notAssigned,2) - parseFloat(assignations) - parseFloat(returns)
        
            res.status(200).json(positiveBalance)
        
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    customersSummary: async(req,res) =>{
      try{
          //get date from
          let dateFrom = new Date()
          dateFrom.setMonth(dateFrom.getMonth() - 12)
          dateFrom.setHours(0, 0, 0, 0)

          //get customers
          let customersData = await customersQueries.customers(dateFrom)
          customersData = customersData.map(cd => cd.get({ plain: true }))

          //get in progress orders
          //let inProgressOrders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
          const orders = await ordersQueries.inProgressOrders()
          const inProgressOrders = orders.map(order => order.get({ plain: true }))

          inProgressOrders.forEach(order => {
            const amountPaid = order.orders_assignations.reduce((sum, oa) => sum +parseFloat(oa.amount,2), 0)
            const balance = parseFloat(order.total) - amountPaid
            order.amountPaid = amountPaid
            order.balance = balance
          })

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
                   .filter(cpa => cpa.type == 'REINTEGRO')
                   .reduce((acc, cpa) => acc + parseFloat(cpa.amount,2), 0)
              
              c.ordersBalance = -ordersBalance
              c.positiveBalance = notAssignedPayments - assignments - returns
              c.netBalance = c.ordersBalance + c.positiveBalance
          })

          customersData.sort((a, b) => a.netBalance - b.netBalance)

          res.status(200).json(customersData)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    postNotes: async(req,res) =>{
      try{

        const data = req.body

        await customersQueries.postNotes(data.notes,data.id)

        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    saveCustomerPayment: async(req,res) =>{
      try{

        const data = req.body
        const date = new Date()
        data.date = date

        //save data in payments
        const newPayment = await paymentsQueries.registerCustomerPayment(data)

        //save data un payments assignations
        const assignation = {
          date: data.date,
          type: data.type == 'PAGO' ? 'PAGO NO ASIGNADO' : 'REINTEGRO',
          id_payments: newPayment.id,
          id_customers:data.id_customers,
          amount:data.amount
        }

        await paymentsAssignationsQueries.create(assignation)


        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    customerMovements: async(req,res) =>{
      try{

        const idCustomer = req.params.idCustomer

        //get date from
        let dateFrom = new Date()
        dateFrom.setMonth(dateFrom.getMonth() - 12)
        dateFrom.setHours(0, 0, 0, 0)
        
        //get orders
        let orders = await ordersQueries.findCustomerOrders(idCustomer,dateFrom)
        
        //get payments
        let payments = await paymentsQueries.findCustomerPayments(idCustomer,dateFrom)
       
        //concatenate data
        let customerMovements = [...orders, ...payments]
        customerMovements.sort((a, b) => new Date(a.date) - new Date(b.date))
        customerMovements = customerMovements.map(c => {
          c.total = c.type == 'PAGO' ? parseFloat(c.total, 10) : -parseFloat(c.total, 10)
          return c
        })

        if (customerMovements.length > 0) {
          customerMovements[0].balance = customerMovements[0].total
        }

        for (let i = 1; i < customerMovements.length; i++) {
          customerMovements[i].balance = customerMovements[i-1].balance + customerMovements[i].total          
        }

        res.status(200).json(customerMovements)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    updatePaymentStatus: async(req,res) =>{
      try{

        const data = req.body

        await ordersQueries.updatePaymentsStatusById(data.orderId,data.id_payments_status)

        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
}

module.exports = ordersController

