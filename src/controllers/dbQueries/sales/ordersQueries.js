const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_orders = db.local.Sales_orders
const Sales_orders_details = db.local.Sales_orders_details

const ordersQueries = {
    inProgressOrders: async() => {
        const orders = await Sales_orders.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_orders_status'},
                {association: 'orders_payments_status'},
                {association: 'orders_orders_managers'},
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'}
            ],
            where:{
                enabled:1,
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['date','ASC'],['id','ASC']],
            nest:true
        })
        return orders
    },
    newOrder: async() => {
        const difOrders = await Sales_orders.findAll({
            where: {id_sales_channels:[1,2]},
            raw:true,
        })

        const newOrderNumber = difOrders.length + 1

        return newOrderNumber
    },
    filterOrder: async(orderNumber) => {
        const order = await Sales_orders.findOne({
            where: {order_number:orderNumber},
            raw:true,
        })

        return order
    },
    createOrder: async(data) => {
        
        const date = new Date()

        //create order
        await Sales_orders.create({
            date:date,
            order_number:data.order_number,
            id_sales_channels:data.id_sales_channels,
            id_customers:data.id_customers,
            subtotal:data.subtotal,
            discount:data.discount,
            total:data.total,
            id_orders_status:data.id_orders_status,
            id_payments_status:3,
            id_orders_managers:1,            
            observations:data.observations,
            enabled:1
        })
    },
    createOrderDetails: async(data,orderId) => {

        const orderDetails = data.order_details

        for (let i = 0; i < orderDetails.length; i++) {
            //create row
            await Sales_orders_details.create({
                id_orders:orderId,
                id_products:orderDetails[i].id_products,
                description:orderDetails[i].description,
                color:orderDetails[i].color,
                size:orderDetails[i].size,
                unit_price: orderDetails[i].unit_price,
                quantity:orderDetails[i].quantity == '' ? null : orderDetails[i].quantity,
                extended_price:orderDetails[i].extended_price
            })            
        }        
    },
    lastId: async() => {
        const lastId = await Sales_orders.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']]
          })

          return lastId.id
    },
    deliverOrder: async(orderId) => {        
        await Orders.update(
            { id_orders_status: 3 },
            { where: { id: orderId } }
        )
    },
    assignOrderManager: async(orderId,orderManagerId) => {
        await Sales_orders.update(
            {
                id_orders_managers:orderManagerId
            },
            {
                where:{id:orderId}
            }
        )
    },
    cancelOrder: async(orderId) => {        
        await Sales_orders.update(
            { enabled: 0 },
            { where: { id: orderId } }
        )
    },
    updatePaymentsStatus: async(orderId) => {

        let amountPaidPayments = 0
        let amountPaidAccounts = 0
        let amountPaid = 0

        let idPaymentsStatus = 3

        //fin order data
        const orderToUpdate = await Sales_orders.findOne({
            where:{id:orderId},
            include: [
                {association: 'orders_payments'},
                {association: 'orders_accounts_movements'}
            ],
            nest:true
        })

        //sum order payments
        orderToUpdate.orders_payments.forEach(payment => {
            amountPaidPayments += parseFloat(payment.amount,2)
        })

        //sum order account movements
        orderToUpdate.orders_accounts_movements.forEach(movement => {
            amountPaidAccounts += parseFloat(movement.amount,2)
        })

        amountPaid = amountPaidPayments + amountPaidAccounts

        console.log(amountPaid)

        idPaymentsStatus = (amountPaid < orderToUpdate.total && amountPaid > 0) ? 4 : 5
        
        await Sales_orders.update(
            { id_payments_status: idPaymentsStatus },
            { where: { id: orderId } }
        )
    },
    webAndDifSales: async(iDate,fDate) => {
        const webAndDifSales = await Sales_orders.findAll({
            include: [
                {association: 'orders_customers'}
            ],
            where:{
                enabled:1,
                id_orders_status:3,
                date: {
                    [Op.between]: [iDate,fDate]
                }
                
            },
            order:[['date','ASC'],['id','ASC']],
            nest:true
        })
        return webAndDifSales
    },
}       

module.exports = ordersQueries

