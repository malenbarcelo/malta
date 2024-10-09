const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_payments_methods

const paymenMethodsQueries = {
    paymentMethods: async() => {
        const paymentMethods = await model.findAll({
            order:[['payment_method','ASC']],
            raw:true,
        })
        return paymentMethods
    }
}       

module.exports = paymenMethodsQueries