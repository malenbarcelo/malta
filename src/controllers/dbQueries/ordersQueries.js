const db = require('../../../database/models')
const { localDB } = require('../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op } = require('sequelize');
const Orders = db.local.Orders

const ordersQueries = {
    inProgressOrders: async() => {
        const orders = await Orders.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_orders_status'},
                {association: 'orders_payments_status'},
                {association: 'orders_orders_managers'}
            ],
            where:{
                enabled:1,
                [Op.or]: [
                    { id_orders_status: { [Op.ne]: 3 } },
                    { id_payments_status: { [Op.ne]: 5 } }
                ]
            },
            order:[['date','ASC'],['id','ASC']],
            raw:true,
            nest:true
        })
        return orders
    },
    newOrder: async() => {
        const difOrders = await Orders.findAll({
            where: {sales_channel:['Difusión1','Difusión2']},
            raw:true,
        })

        const newOrderNumber = difOrders.length + 1

        return newOrderNumber
    },
    filterOrder: async(orderNumber) => {
        const order = await Orders.findOne({
            where: {order_number:orderNumber},
            raw:true,
        })

        return order
    },
    createOrder: async(data) => {
        
        const date = new Date()

        //create order
        await Orders.create({
            date:date,
            order_number:data.order_number,
            sales_channel:data.sales_channel,
            id_customers:data.id_customers,
            subtotal:data.subtotal,
            discount:data.discount,
            total:data.total,
            balance:data.balance,
            status:data.status,
            order_manager:data.order_manager,
            observations:data.observations
        })
    },
    createOrderDetails: async(data,orderId) => {

        const orderDetails = data.order_details

        for (let i = 0; i < orderDetails.length; i++) {
            //create row
            await Orders_details.create({
                id_orders:orderId,
                id_products:orderDetails[i].id_products,
                description:orderDetails[i].description,
                color:orderDetails[i].color,
                size:orderDetails[i].size,
                unit_price: orderDetails[i].unit_price,
                quantity:orderDetails[i].quantity,
                extended_price:orderDetails[i].extended_price
            })            
        }        
    },
    lastId: async() => {
        const lastId = await Orders.findOne({
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
        await Orders.update(
            {
                id_orders_managers:orderManagerId
            },
            {
                where:{id:orderId}
            }
        )
    },
    cancelOrder: async(orderId) => {        
        await Orders.update(
            { enabled: 0 },
            { where: { id: orderId } }
        )
    },
    updatePaymentsStatus: async(paymentsStatusId,orderId) => {                
        await Orders.update(
            { id_payments_status: paymentsStatusId },
            { where: { id: orderId } }
        )
    },
}       

module.exports = ordersQueries