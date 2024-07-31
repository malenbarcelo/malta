const db = require('../../../../database/models')
const sequelize = require('sequelize')
const model = db.Cuttings_products

const productsQueries = {
    products: async() => {
        const products = await model.findAll({
            order:[['description','ASC']],
            raw:true,
        })
        return products
    },
    distinctProducts: async() => {
        const distinctProducts = await model.findAll({
            attributes: [[sequelize.fn('DISTINCT', sequelize.col('description')), 'description']],
            raw:true,
        })
        return distinctProducts
    },
    productOptions: async(productDescription) => {

        let sizes = []
        let colors = []

        const products = await model.findAll({
            where: {description: productDescription},
            raw:true,
        })

        for (let i = 0; i < products.length; i++) {
            sizes.push(products[i].size)
            colors.push(products[i].color)
        }

        //eliminate duplicates
        sizes = [...new Set(sizes)]
        colors = [...new Set(colors)]

        //order data
        const productOptions = {
            sizes:sizes.sort(),
            colors:colors.sort()
        }

        return productOptions
    },
    sizesOptions: async(productDescription,color) => {

        let sizes = []

        const products = await model.findAll({
            where: {
                description: productDescription,
                color: color
            },
            raw:true,
        })

        for (let i = 0; i < products.length; i++) {
            sizes.push(products[i].size)
        }

        //eliminate duplicates
        sizes = [...new Set(sizes)]

        const sizesOptions = {
            sizes:sizes.sort()
        }

        return sizesOptions
    },
    colorsOptions: async(productDescription,size) => {

        let colors = []

        const products = await model.findAll({
            where: {
                description: productDescription,
                size: size
            },
            raw:true,
        })

        for (let i = 0; i < products.length; i++) {
            colors.push(products[i].color)
        }

        //eliminate duplicates
        colors = [...new Set(colors)]

        const colorsOptions = {
            colors:colors.sort()
        }

        return colorsOptions
    },
}       

module.exports = productsQueries