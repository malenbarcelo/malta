const db = require('../../../../database/models')
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
    createOrderItemmeta: async(newOrderItemmeta,month,year) => {
        for (let i = 0; i < newOrderItemmeta.length; i++) {
            await model.create({
                meta_id:newOrderItemmeta[i].meta_id,
                order_item_id:newOrderItemmeta[i].order_item_id,
                meta_key:newOrderItemmeta[i].meta_key,
                meta_value:newOrderItemmeta[i].meta_value,
                month:month,
                year:year
            })
        }
    },
}       

module.exports = wpOrderItemmetaQueries