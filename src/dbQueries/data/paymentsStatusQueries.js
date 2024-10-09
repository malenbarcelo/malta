const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_payments_status

const paymentsStatusQueries = {
    paymentsStatus: async() => {
        const payments_status = await model.findAll({
            raw:true,
        })
        return payments_status
    },
}       

module.exports = paymentsStatusQueries