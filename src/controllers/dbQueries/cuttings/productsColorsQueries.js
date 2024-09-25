const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_products_colors

const productsColorsQueries = {
    bulkCreate: async(data) => {
        await model.bulkCreate(data)
    },
}       

module.exports = productsColorsQueries