const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_customers

const customersQueries = {
    customers: async() => {
        const customers = await model.findAll({
            order:[['customer_name','ASC']],
            raw:true,
        })
        return customers
    },
}       

module.exports = customersQueries