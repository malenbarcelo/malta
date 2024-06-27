const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_orders_ninox = db.local.Sales_orders_ninox
const customersQueries = require('../data/customersQueries')
const productsQueries = require('../cuttings/productsQueries')
const paymenMethodsQueriesQueries = require('../data/paymentMethodsQueries')

const ninoxOrdersQueries = {
    ninoxSales: async(iDate,fDate) => {
        const ninoxSales = await Sales_orders_ninox.findAll({
            include: [
                {association: 'orders_customers'}
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
    saveOrders: async(data) => {
        for (let i = 0; i < data.length; i++) {
            await Sales_orders_ninox.create({
                date:data[i].date,
                order_number:data[i].order_number,
                sales_channel:'Local',
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
    }
}
        

module.exports = ninoxOrdersQueries

