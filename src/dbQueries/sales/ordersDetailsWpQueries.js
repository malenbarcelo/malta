const db = require('../../../database/models')
const sequelize = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Sales_orders_details_wp

const ordersDetailsWpQueries = {
    create: async(detailsToCreate) => {
        await model.bulkCreate(detailsToCreate)
    },
  
}       

module.exports = ordersDetailsWpQueries

