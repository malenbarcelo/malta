const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_details_colors

const ordersDetailsColorsQueries = {
    create: async(data) => {
        model.bulkCreate(data)
    },
    delete: async(ids) => {
        await model.destroy(
            { where: { id_orders_details: ids } }
        )
    },
    get: async({filters}) => {
                    
        let where = {}

        if (filters.id_orders_details) {
            where.id_orders_details = filters.id_orders_details
        }

        const data = await model.findAndCountAll({
            include:[{association:'color_data'}],
            where,
            raw:true,
            nest:true
        })

        return data
    },
}       

module.exports = ordersDetailsColorsQueries

