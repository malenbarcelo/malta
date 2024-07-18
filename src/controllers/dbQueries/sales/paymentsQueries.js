const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_payments = db.local.Sales_payments

const paymentsQueries = {
    inProgressOrdersPayments: async(ordersIds) => {
        const orderPayments = await Sales_payments.findAll({
            attributes: [
                'id_orders',
                [fn('SUM', col('amount')), 'total_amount']
              ],
            group: ['id_orders'],
            where:{id_orders:ordersIds},
            raw:true,
        })

        return orderPayments
    },
    registerOrderPayment: async(idOrder,idCustomer,orderPayment,idPaymentMethod) => {

        console.log('metodo de pago' + idPaymentMethod)
        
        const date = new Date()

        await Sales_payments.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:orderPayment,
            id_payments_methods:idPaymentMethod
        })
    },
    registerAccountPayment: async(idCustomer,accountPayment,idPaymentMethod) => {
        
        const date = new Date()

        await Sales_payments.create({
            date:date,
            id_customers:idCustomer,
            id_orders:null,
            amount:accountPayment,
            id_payments_methods:idPaymentMethod
        })
    },
    positiveBalance: async(idCustomer) => {
        const positiveBalance = await Sales_payments.findOne({
            attributes: [
                [fn('SUM', col('amount')), 'total_amount']
              ],
            group: ['id_customers'],
            where:{
                id_customers:idCustomer,
                id_orders: null,
            },
            raw:true,
        })

        return positiveBalance
    },
}       

module.exports = paymentsQueries