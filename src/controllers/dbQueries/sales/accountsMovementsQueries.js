const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Accounts_movements = db.local.Accounts_movements

const accountMovementsQueries = {
    positiveBalanceUsed: async(idCustomer) => {
        const positiveBalanceUsed = await Accounts_movements.findOne({
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

        await Accounts_movements.create({
            date:date,
            id_orders:idOrder,
            id_customers:idCustomer,
            amount:amountPaid
        })
    },
}

module.exports = accountMovementsQueries