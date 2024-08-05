const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_details

const ordersDetailsQueries = {
    inProgressOrdersDetails: async() => {
        const ordersDetails = await model.findAll({
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
                        {association: 'orders_orders_managers'},
                        {association: 'orders_payments_status'}
                    ]
                }
            ],
            where:{enabled:1},
            order:[['id_orders','ASC']],
            nest:true
        })
        return ordersDetails
    },
    cancelOrderDetail: async(lineId,observations) => {        
        await model.update(
            { 
                enabled: 0,
                observations:observations 
            },
            { where: { id: lineId } }
        )
    },
    findOrderDetails: async(idOrders) => {
        const findOrderDetails = await model.findAll({
            where:{
                id_orders:idOrders
            },
            raw:true
        })
        return findOrderDetails
    },
    editOrderDetail: async(lineId,data,observations) => {        
        await model.update(
            { 
                unit_price:data.unit_price,
                required_quantity:data.required_quantity == '' ? null : data.required_quantity,
                confirmed_quantity:data.confirmed_quantity == '' ? null : data.confirmed_quantity,
                extended_price: data.unit_price * (data.confirmed_quantity == '' ? 0 : data.confirmed_quantity),
                observations:observations 
            },
            { where: { id: lineId } }
        )
    },
    delete: async(orderId) => {        
        await model.destroy(
            { where: { id_orders: orderId } }
        )
    },
    updateOrderDetailObs: async(orderDetailId,observations) => {        
        await model.update(
            {
                observations2: observations
             },
            { where: { id: orderDetailId } }
        )
    },
    createOrdersDetails: async(ordersDetailsToCreate) => {
        model.bulkCreate(ordersDetailsToCreate)
    },
}       

module.exports = ordersDetailsQueries

