const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_payments_methods = db.local.Data_payments_methods

const paymenMethodsQueries = {
    paymentMethods: async() => {
        const paymentMethods = await Data_payments_methods.findAll({
            order:[['payment_method','ASC']],
            raw:true,
        })
        return paymentMethods
    }
}       

module.exports = paymenMethodsQueries