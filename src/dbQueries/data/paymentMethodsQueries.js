const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Data_payments_methods

const paymenMethodsQueries = {
    paymentMethods: async() => {
        const paymentMethods = await model.findAll({
            where:{
                enabled:1
            },
            order:[['payment_method','ASC']],
            raw:true,
        })
        return paymentMethods
    },
    create: async(data) => {
        await model.create(data)
    },
    update: async(newData,id) => {
        await model.update(newData, {
            where: { id: id }
        });
    },
    destroy: async(id) => {
        await model.destroy({
            where: { id }
        });
    },
}       

module.exports = paymenMethodsQueries