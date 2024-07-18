const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_orders_details = db.local.Sales_orders_details

const ordersDetailsQueries = {
    inProgressOrdersDetails: async() => {
        const ordersDetails = await Sales_orders_details.findAll({
            include: [
                {
                    association: 'orders_details_orders',
                    where:{
                        enabled:1,
                        [Op.or]: [
                            { id_orders_status: { [Op.ne]: 3 } }
                        ]
                    },
                    include: [
                        {association: 'orders_customers'},
                        {association: 'orders_sales_channels'},
                        {association: 'orders_orders_status'},
                        {association: 'orders_orders_managers'}
                    ]
                }
            ],
            where:{enabled:1},
            order:[['id_orders','ASC']],
            nest:true
        })
        return ordersDetails
    },
    cancelOrderDetail: async(orderId,observations) => {        
        await Sales_orders_details.update(
            { 
                enabled: 0,
                observations:observations 
            },
            { where: { id: orderId } }
        )
    },
    orderDetails: async(orderId) => {
        const orderDetails = await Sales_orders_details.findAll({
            where:{
                enabled:1,
                /*id_orders:orderId*/
            },
            raw:true
        })
        return orderDetails
    },
}       

module.exports = ordersDetailsQueries

