const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_orders_status

const ordersStatusQueries = {
    ordersStatus: async() => {
        const orders_status = await model.findAll({
            raw:true,
        })
        return orders_status
    },
}       

module.exports = ordersStatusQueries