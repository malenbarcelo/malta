const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_orders_managers

const ordersManagersQueries = {
    ordersManagers: async() => {
        const ordersManagers = await model.findAll({
            order:[['order_manager_name','ASC']],
            raw:true,
        })
        return ordersManagers
    }
}       

module.exports = ordersManagersQueries