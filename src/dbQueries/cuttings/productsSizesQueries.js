const db = require('../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_products_sizes

const productsSizesQueries = {
    bulkCreate: async(data) => {
        await model.bulkCreate(data)
    },
    delete: async(id) => {
        await model.destroy({
            where:{
                id_products:id
            }
        })
    },
}       

module.exports = productsSizesQueries