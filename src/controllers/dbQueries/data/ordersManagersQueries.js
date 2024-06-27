const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_orders_managers = db.local.Data_orders_managers

const ordersManagersQueries = {
    ordersManagers: async() => {
        const ordersManagers = await Data_orders_managers.findAll({
            order:[['order_manager_name','ASC']],
            raw:true,
        })
        return ordersManagers
    }
}       

module.exports = ordersManagersQueries