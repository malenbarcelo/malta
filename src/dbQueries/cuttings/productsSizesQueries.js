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
    get: async({filters}) => {
                    
        let where = {}

        if (filters.id_products) {
            where.id_products = filters.id_products
        }

        const data = await model.findAndCountAll({
            include:[{association:'size_data'}],
            where,
            raw:true,
            nest:true
        })

        return data
    },
}       

module.exports = productsSizesQueries