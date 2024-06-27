const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_payments_status = db.local.Data_payments_status

const paymentsStatusQueries = {
    paymentsStatus: async() => {
        const payments_status = await Data_payments_status.findAll({
            raw:true,
        })
        return payments_status
    },
}       

module.exports = paymentsStatusQueries