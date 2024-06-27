const db = require('../../../../database/models')
const sequelize = require('sequelize')
const { localDB } = require('../../../../database/config/sequelizeConfig')
const Data_customers = db.local.Data_customers

const customersQueries = {
    customers: async() => {
        const customers = await Data_customers.findAll({
            order:[['customer_name','ASC']],
            raw:true,
        })
        return customers
    },
}       

module.exports = customersQueries