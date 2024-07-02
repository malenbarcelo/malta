const db = require('../../../../database/models')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const Sales_orders_ninox_details = db.local.Sales_orders_ninox_details

const ordersNinoxDetailsQueries = {

    saveOrderDetails: async(orderDetails) => {
        for (let i = 0; i < orderDetails.length; i++) {
            //create row
            console.log(orderDetails[i].id_orders)
            await Sales_orders_ninox_details.create({
                id_orders:orderDetails[i].id_orders,
                id_products:orderDetails[i].id_products,
                description:orderDetails[i].description,
                color:orderDetails[i].color,
                size:orderDetails[i].size,
                unit_price: orderDetails[i].unit_price,
                required_quantity:orderDetails[i].required_quantity,
                confirmed_quantity:orderDetails[i].confirmed_quantity,
                extended_price:orderDetails[i].extended_price
            })            
        }        
    },
}       

module.exports = ordersNinoxDetailsQueries

