const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_shipping_methods

const shippingMethodsQueries = {
    getData: async() => {
        const data = await model.findAll({
            where:{
                enabled:1
            },
            order:[['shipping_method','ASC']],
            raw:true,
        })
        return data
    },
    create: async(data) => {
        await model.create(data)
    },
    
}       

module.exports = shippingMethodsQueries