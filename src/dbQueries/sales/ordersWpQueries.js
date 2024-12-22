const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_wp

const ordersWpQueries = {
    getMaxId: async() => {
        const maxId = await model.findOne({
            order: [['post_id', 'DESC']],
            raw: true
        })

        return maxId
    },
    create: async(ordersToCreate) => {
        const orders = await model.bulkCreate(ordersToCreate)
        return orders.length == 0 ? [] : orders.map(order => order.get({ plain: true }))
    },
    inProgressOrdersShowCanceled: async() => {
            const orders = await model.findAll({
                where:{
                    [Op.or]: [
                        { id_orders_status: { [Op.ne]: 3 } },
                        { id_payments_status: { [Op.ne]: 5 } }
                    ]
                },
                include: [
                    {association: 'order_status_data'},
                    {association: 'payment_status_data'}

                ],
                order:[['order_number','DESC']],
                nest:true
            })
            return orders
        },
        customers: async() => {
            const orders = await model.findAll({
                attributes: [[sequelize.fn('DISTINCT', sequelize.col('customer')), 'customer']],
                where:{
                    [Op.or]: [
                        { id_orders_status: { [Op.ne]: 3 } },
                        { id_payments_status: { [Op.ne]: 5 } }
                    ]
                },
                order:[['customer','ASC']],
                raw:true
            })
            return orders
        },
  
}       

module.exports = ordersWpQueries

