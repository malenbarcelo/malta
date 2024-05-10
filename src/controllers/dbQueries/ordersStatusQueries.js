const db = require('../../../database/models')
const sequelize = require('sequelize')

const ordersStatusQueries = {
    ordersStatus: async() => {
        const orders_status = await db.Orders_status.findAll({
            order:[['order_status','ASC']],
            raw:true,
        })
        return orders_status
    },
}       

module.exports = ordersStatusQueries