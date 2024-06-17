const db = require('../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../database/config/sequelizeConfig')
const Payments_status = db.local.Payments_status

const paymentsStatusQueries = {
    paymentsStatus: async() => {
        const payments_status = await Payments_status.findAll({
            raw:true,
        })
        return payments_status
    },
}       

module.exports = paymentsStatusQueries