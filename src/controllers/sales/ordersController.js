const dominio = require("../dominio")
const ordersQueries = require("../../dbQueries/sales/ordersQueries")
const ordersDetailsQueries = require("../../dbQueries/sales/ordersDetailsQueries")
const customersQueries = require("../../dbQueries/data/customersQueries")
const {updateOrderData} = require('../../functions/salesFunctions')
const moment = require('moment-timezone')

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
        const date = new Date(data.date)
        data.date = date.setHours(date.getHours() + 3)

        //save data in payments
        const newPayment = await paymentsQueries.registerCustomerPayment(data)

        //save data in payments assignations
        const assignation = {
          date: data.date,
          type: data.type,
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
          c.total = (c.type == 'PAGO ASIGNADO' || c.type == 'PAGO NO ASIGNADO')  ? parseFloat(c.total, 10) : -parseFloat(c.total, 10)
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
    editOrdersUnitPrice: async(req,res) =>{
      try{
  
        const data = req.body
        
        const date = new Date()
        const argDate = moment(date).tz('America/Argentina/Buenos_Aires').format();
  
        const observations = 'Precio de producto editado el ' + argDate

        //get orders to edit
        let ordersToEdit = await ordersQueries.findOrdersByProducts(data.id_product)
        ordersToEdit = ordersToEdit.map(o => o.get({ plain: true }))
        ordersToEdit = ordersToEdit.map(o => o.id)
  
        //update unit prices
        await ordersDetailsQueries.editUnitPrice(data.unit_price,observations,ordersToEdit,data.id_product)
  
        //update order data
        for (let i = 0; i < ordersToEdit.length; i++) {
          await updateOrderData(ordersToEdit[i])
        }
        
        
  
        res.status(200).json()
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
    notShippedOrders: async(req,res) =>{
      try{
  
        //get not shipped orders
        const notShippedOrders = await ordersQueries.notShippedOrders()        
  
        res.status(200).json(notShippedOrders)
  
      }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
      }
    },
}

module.exports = ordersController

