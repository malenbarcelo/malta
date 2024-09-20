const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_products_types

const productsTypesQueries = {
    allData: async() => {
        const allData = await model.findAll({
            order:[['product_type','ASC']],
            where:{
                enabled:1
            },
            raw:true,
        })
        return allData
    },
    delete: async(id) => {
        await model.update(
            {
                enabled:0,
            },
            {
                where:{
                    id:id
                }
            }
        )
    },
}       

module.exports = productsTypesQueries