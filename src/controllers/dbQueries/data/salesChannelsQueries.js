const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_sales_channels = db.local.Data_sales_channels

const salesChannelsQueries = {
    salesChannels: async() => {
        const salesChannels = await Data_sales_channels.findAll({
            order:[['sales_channel','ASC']],
            raw:true,
        })
        return salesChannels
    },
}       

module.exports = salesChannelsQueries