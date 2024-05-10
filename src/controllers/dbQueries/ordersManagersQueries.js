const db = require('../../../database/models')
const sequelize = require('sequelize')

const ordersManagersQueries = {
    ordersManagers: async() => {
        const orders_managers = await db.Orders_managers.findAll({
            order:[['order_manager_name','ASC']],
            raw:true,
        })
        return orders_managers
    },
}       

module.exports = ordersManagersQueries