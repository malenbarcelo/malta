const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_payments_ninox = db.local.Sales_payments_ninox

const paymentsNinoxQueries = {
    registerOrderPayment: async(orderData, orderId) => {
        await Sales_payments_ninox.create({
            date:orderData.date,
            id_orders:orderId,
            id_customers:orderData.id_customers,
            amount:orderData.total,
            id_payments_methods:orderData.id_payments_methods,
            payment_method:orderData.payment_method,
            enabled:1
        })  
    },
    cancelPayment: async(orderId) => {
        
        await Sales_payments_ninox.update(
            { enabled: 0 },
            { where: { id_orders: orderId } }
        )  
    },
}       

module.exports = paymentsNinoxQueries