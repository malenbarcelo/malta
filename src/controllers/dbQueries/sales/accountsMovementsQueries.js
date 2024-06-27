const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_accounts_movements = db.local.Sales_accounts_movements

const accountMovementsQueries = {
    positiveBalanceUsed: async(idCustomer) => {
        const positiveBalanceUsed = await Sales_accounts_movements.findOne({
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

        await Sales_accounts_movements.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:amountPaid
        })
    },
}

module.exports = accountMovementsQueries