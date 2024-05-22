const db = require('../../../database/models')
const sequelize = require('sequelize')

const ordersQueries = {
    orders: async() => {
        const orders = await db.Orders.findAll({
            order:[['date','ASC'],['id','ASC']],
            raw:true,
        })

        return orders
    },
    newOrder: async() => {
        const difOrders = await db.Orders.findAll({
            where: {sales_channel:['Difusión1','Difusión2']},
            raw:true,
        })

        const newOrderNumber = difOrders.length + 1

        return newOrderNumber
    },
    filterOrder: async(orderNumber) => {
        const order = await db.Orders.findOne({
            where: {order_number:orderNumber},
            raw:true,
        })

        return order
    },
    createOrder: async(data) => {
        
        const date = new Date()

        //create order
        await db.Orders.create({
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
            await db.Orders_details.create({
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
        const lastId = await db.Orders.findOne({
            attributes: [[sequelize.fn('max', sequelize.col('id')), 'id']]
          })

          return lastId.id
    },
}       

module.exports = ordersQueries