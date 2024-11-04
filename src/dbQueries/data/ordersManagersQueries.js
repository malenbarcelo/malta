const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_orders_managers

const ordersManagersQueries = {
    ordersManagers: async() => {
        const ordersManagers = await model.findAll({
            include: [{association: 'user_data'}],
            order:[['order_manager_name','ASC']],
            raw:true,
            nest:true
        })
        return ordersManagers
    },
    findOrderManager: async(idUser) => {
        const ordersManagers = await model.findAll({
            include: [{
                    association: 'user_data',
                    where: { id: idUser }
                }
            ],
            raw:true,
            nest:true
        })
        return ordersManagers
    }
}       

module.exports = ordersManagersQueries