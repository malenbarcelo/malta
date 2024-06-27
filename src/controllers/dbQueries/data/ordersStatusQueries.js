const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_orders_status = db.local.Data_orders_status

const ordersStatusQueries = {
    ordersStatus: async() => {
        const orders_status = await Data_orders_status.findAll({
            raw:true,
        })
        return orders_status
    },
}       

module.exports = ordersStatusQueries