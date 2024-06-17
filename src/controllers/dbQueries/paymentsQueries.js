const db = require('../../../database/models')
const { localDB } = require('../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Payments = db.local.Payments

const paymentsQueries = {
    inProgressOrdersPayments: async(ordersIds) => {
        const orderPayments = await Payments.findAll({
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
    registerOrderPayment: async(idOrder,idCustomer,amountPaid,idPaymentMethod) => {
        
        const date = new Date()

        await Payments.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:amountPaid,
            id_payment_methods:idPaymentMethod
        })
    },
    registerPayment: async(idCustomer,exceededAmount,idPaymentMethod) => {
        
        const date = new Date()

        await Payments.create({
            date:date,
            id_customers:idCustomer,
            id_orders:null,
            amount:exceededAmount,
            id_payment_methods:idPaymentMethod
        })
    },
}       

module.exports = paymentsQueries