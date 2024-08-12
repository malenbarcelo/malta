const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_payments

const paymentsQueries = {
    inProgressOrdersPayments: async(ordersIds) => {
        const orderPayments = await model.findAll({
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
        
        const date = new Date()

        await model.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:orderPayment,
            id_payments_methods:idPaymentMethod
        })
    },
    registerAccountPayment: async(idCustomer,accountPayment,idPaymentMethod) => {
        
        const date = new Date()

        await model.create({
            date:date,
            id_customers:idCustomer,
            id_orders:null,
            amount:accountPayment,
            id_payments_methods:idPaymentMethod
        })
    },
    positiveBalance: async(idCustomer) => {
        const positiveBalance = await model.findOne({
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
    lastYearPayments: async(dateFrom) => {
        const lastYearPayments = await model.findAll({
            where: {
                [Op.and]: [
                    sequelize.where(
                        fn('DATE', col('date')),
                        {
                            [Op.gt]: new Date(dateFrom)
                        }
                    )
                ]
            },
            order: [['date', 'DESC']],
            raw:true
        })
        return lastYearPayments
    },
    customersNullPayments: async(dateFrom) => {
        const customersNullPayments = await model.findAll({
            attributes: [
                'id_customers', 
                [fn('SUM', col('amount')), 'total_amount']
            ],
            where: {
                id_orders: null,
                [Op.and]: [
                    sequelize.where(
                        fn('DATE', col('date')),
                        {
                            [Op.gt]: new Date(dateFrom)
                        }
                    )
                ]
            },
            group: ['id_customers'], 
            order: [
                [literal('SUM(amount)'), 'DESC']
            ],
            raw:true
        })
        return customersNullPayments
    },
}       

module.exports = paymentsQueries