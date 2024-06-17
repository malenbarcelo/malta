const db = require('../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../database/config/sequelizeConfig')
const Orders_status = db.local.Orders_status

const ordersStatusQueries = {
    ordersStatus: async() => {
        const orders_status = await Orders_status.findAll({
            raw:true,
        })
        return orders_status
    },
}       

module.exports = ordersStatusQueries