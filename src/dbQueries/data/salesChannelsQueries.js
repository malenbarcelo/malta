const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_sales_channels

const salesChannelsQueries = {
    salesChannels: async() => {
        const salesChannels = await model.findAll({
            order:[['sales_channel','ASC']],
            raw:true,
        })
        return salesChannels
    },
}       

module.exports = salesChannelsQueries