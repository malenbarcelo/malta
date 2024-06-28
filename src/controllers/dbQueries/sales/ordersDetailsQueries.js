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
            order:[['id_orders','ASC']],
            nest:true
        })
        return ordersDetails
    },
}       

module.exports = ordersDetailsQueries

