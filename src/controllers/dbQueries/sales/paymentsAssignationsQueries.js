const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_payments_assignations

const paymentsAssignationsQueries = {
    create: async(data) => {
        
        await model.create(data)
    },
    customerAssignations: async(dateFrom) => {
        const customersAssignations = await model.findAll({
            attributes: [
                'type',
                'id_customers',
                [sequelize.fn('SUM', sequelize.col('amount')), 'total_amount']
              ],
            where: {
                [Op.and]: [
                    sequelize.where(
                        fn('DATE', col('date')),
                        {
                            [Op.gt]: new Date(dateFrom)
                        }
                    )
                ],
            },
            group: ['type','id_customers'],
            raw:true
        })
        return customersAssignations
    },
    registerAssignation: async(type, idPayment, idCustomer, idOrder, amount) => {
        
        const date = new Date()

        await model.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:amount,
            id_payments:idPayment,
            type:type
        })
    },
}

module.exports = paymentsAssignationsQueries