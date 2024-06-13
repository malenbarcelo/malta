const db = require('../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../database/config/sequelizeConfig')
const Orders_managers = db.local.Orders_managers

const ordersManagersQueries = {
    ordersManagers: async() => {
        const orders_managers = await Orders_managers.findAll({
            order:[['order_manager_name','ASC']],
            raw:true,
        })
        return orders_managers
    },
}       

module.exports = ordersManagersQueries