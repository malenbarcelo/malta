const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_wp_order_itemmeta

const wpOrderItemmetaQueries = {
    monthOrderItemmeta: async(month,year) => {
        const monthOrderItemmeta = await model.findAll({
            where:{
                month:month,
                year:year
            },
            raw:true,
        })
        return monthOrderItemmeta
    },
    createOrderItemmeta: async(newOrderItemmeta) => {
        await model.bulkCreate(newOrderItemmeta)
    },
    getMaxId: async() => {
        const maxId = await model.findOne({
            order: [['meta_id', 'DESC']],
            raw: true
        })

        return maxId
    },
}       

module.exports = wpOrderItemmetaQueries