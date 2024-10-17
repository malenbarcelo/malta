const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_details_sizes

const ordersDetailsSizesQueries = {
    create: async(data) => {
        model.bulkCreate(data)
    },
    delete: async(ids) => {
        await model.destroy(
            { where: { id_orders_details: ids } }
        )
    },
}       

module.exports = ordersDetailsSizesQueries

