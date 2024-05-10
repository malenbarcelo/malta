const db = require('../../../database/models')
const sequelize = require('sequelize')

const productsQueries = {
    products: async() => {
        const products = await db.Products.findAll({
            order:[['description','ASC']],
            raw:true,
        })
        return products
    },
    distinctProducts: async() => {
        const distinctProducts = await db.Products.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('description')), 'description']],
            raw:true,
        })
        return distinctProducts
    },
    productOptions: async(productDescription) => {

        const sizes = []
        const colors = []

        const products = await db.Products.findAll({
            where: {description: productDescription},
            raw:true,
        })

        for (let i = 0; i < products.length; i++) {
            sizes.push(products[i].size)
            colors.push(products[i].color)
        }

        const productOptions = {
            sizes:sizes.sort(),
            colors:colors.sort()
        }

        return productOptions
    },
}       

module.exports = productsQueries