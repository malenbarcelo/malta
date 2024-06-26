const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Customers = db.local.Customers

const customersQueries = {
    customers: async() => {
        const customers = await Customers.findAll({
            order:[['customer_name','ASC']],
            raw:true,
        })
        return customers
    },
}       

module.exports = customersQueries