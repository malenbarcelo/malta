
const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_ninox

const ninoxOrdersQueries = {
    ninoxSales: async(iDate,fDate) => {
        const ninoxSales = await model.findAll({
            include: [
                {association: 'orders_customers'},
                {association: 'orders_sales_channels'}
            ],
            where:{
                enabled:1,
                id_orders_status:3,
                id_payments_status:5,
                date: {
                    [Op.between]: [iDate, fDate]
                }
                
            },
            order:[['date','ASC'],['id','ASC']],
            nest:true
        })
        return ninoxSales
    },
    getOrder: async(orderNumber) => {
        const getOrder = await model.findAll({            
            where:{
                order_number:orderNumber,
            }
        })

        const orderId = getOrder[0].id
        
        return orderId
    },
    monthOrders: async(month,year) => {
        const monthOrders = await model.findAll({
            where: {
                date: {
                    [sequelize.Op.and]: [
                        sequelize.where(sequelize.fn('MONTH', sequelize.col('date')), month),
                        sequelize.where(sequelize.fn('YEAR', sequelize.col('date')), year)
                    ]
                }
            },
            order: [['date', 'DESC'], ['id', 'DESC']],
            raw: true
        })
        return monthOrders
    },
    saveOrders: async(data) => {
        for (let i = 0; i < data.length; i++) {
            await model.create({
                date:data[i].date,
                order_number:data[i].order_number,
                id_sales_channels:5,
                customer_name:data[i].customer_name,
                id_customers:data[i].id_customers,
                subtotal:data[i].subtotal,
                discount:data[i].discount,
                total:data[i].total,
                id_orders_status:data[i].id_orders_status,
                id_payments_status:data[i].id_payments_status,
                id_orders_managers:data[i].id_orders_managers,
                observations:data[i].observations,
                enabled:data[i].enabled
            })
        }
    },
    cancelOrder: async(orderId) => {        
        await model.update(
            { enabled: 0 },
            { where: { id: orderId } }
        )
    },
}
        

module.exports = ninoxOrdersQueries

