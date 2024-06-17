const db = require('../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../database/config/sequelizeConfig')
const Payment_methods = db.local.Payment_methods

const paymenMethodsQueries = {
    paymentMethods: async() => {
        const paymentMethods = await Payment_methods.findAll({
            order:[['payment_method','ASC']],
            raw:true,
        })
        return paymentMethods
    }
}       

module.exports = paymenMethodsQueries