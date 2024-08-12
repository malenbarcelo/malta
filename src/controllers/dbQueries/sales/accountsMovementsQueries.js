const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_accounts_movements

const accountMovementsQueries = {
    positiveBalanceUsed: async(idCustomer) => {
        const positiveBalanceUsed = await model.findOne({
            attributes: [
                [fn('SUM', col('amount')), 'total_amount']
              ],
            group: ['id_customers'],
            where:{
                id_customers:idCustomer
            },
            raw:true,
        })

        return positiveBalanceUsed
    },

    registerMovement: async(idOrder,idCustomer,amountPaid) => {
        
        const date = new Date()

        await model.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:amountPaid
        })
    },
    lastYearAccountsMovements: async(dateFrom) => {
        const lastYearAccountsMovements = await model.findAll({
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

        return lastYearAccountsMovements
    },
    customersMovements: async(dateFrom) => {
        const customersMovements = await model.findAll({
            attributes: [
                'id_customers', 
                [fn('SUM', col('amount')), 'total_amount']
            ],
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
            group: ['id_customers'], 
            order: [
                [literal('SUM(amount)'), 'DESC']
            ],
            raw:true
        })
        return customersMovements
    },
}

module.exports = accountMovementsQueries