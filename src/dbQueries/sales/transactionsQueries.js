const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col, literal } = require('sequelize')
const model = db.Sales_transactions

const transactionsQueries = {
    get: async({limit,offset,filters}) => {
            
        const where = {}

        if (filters.id_customers) {
            where.id_customers = filters.id_customers
        }

        if (filters.id_orders) {
            where.id_orders = filters.id_orders
        }

        if (filters.date_from) {
            where.date = {
                [Op.and]: [
                    sequelize.where(
                        fn('DATE', col('Sales_transactions.date')),
                        {
                            [Op.gt]: new Date(filters.date_from)
                        }
                    )
                ]
            }
        }

        const data = await model.findAndCountAll({
            include: [{
                association: 'order_data',
                attributes: ['order_number']
            }],
            where,
            limit,
            offset,
            raw:true,
            nest:true,
            order: [[col('Sales_transactions.date'), 'ASC']],
        })

        return data
    },
    create: async(data) => {
        await model.bulkCreate(data)
    },
    update: async(data) => {        
        for (const d of data) {
            await model.update(
            d, 
            { where: { id: d.id } }
            )
        }
    },
    sumTransactions: async(orderId) => {
        const transactions = await model.sum('amount', {
            where: {
              id_orders: orderId,
              type: {
                [Op.or]: ['PAGO ASIGNADO', 'ASIGNACION']
              }
            }
        })

        return transactions
    },
    resumedTransactions: async({filters}) => {

        const where ={}

        if (filters.id_customers) {
            where.id_customers = filters.id_customers            
        }

        const transactions = await model.findAll({
            attributes: [
                'type',
                [sequelize.fn('SUM', sequelize.col('amount')), 'totalAmount']
            ],
            where,
            group: ['type'],
            type: {
                [Op.or]: ['PAGO NO ASIGNADO', 'ASIGNACION', 'REINTEGRO']
            },
            raw:true
        })
    
        return transactions
    }

}       

module.exports = transactionsQueries