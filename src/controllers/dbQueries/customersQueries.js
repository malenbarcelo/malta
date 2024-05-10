const db = require('../../../database/models')
const sequelize = require('sequelize')

const customersQueries = {
    customers: async() => {
        const customers = await db.Customers.findAll({
            order:[['customer_name','ASC']],
            raw:true,
        })
        return customers
    },
}       

module.exports = customersQueries