const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const model = db.local.Sales_wp_order_items
const { Op } = require('sequelize')

const wpOrderItemsQueries = {
    monthOrderItems: async(month,year) => {
        const monthOrderItems = await model.findAll({
            where:{
                month:month,
                year:year
            },
            raw:true,
        })
        return monthOrderItems
    },
    createOrderItem: async(newOrderItems,month,year) => {
        for (let i = 0; i < newOrderItems.length; i++) {
            await model.create({
                order_item_id:newOrderItems[i].order_item_id,
                order_item_name:newOrderItems[i].order_item_name,
                order_item_type:newOrderItems[i].order_item_type,
                order_id:newOrderItems[i].order_id,
                month:month,
                year:year
            })
        }
    },
}       

module.exports = wpOrderItemsQueries