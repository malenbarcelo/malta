const db = require('../../../database/models')
const { sequelize } = require('sequelize')
const { Op, fn, col } = require('sequelize')
const model = db.Cuttings_products

const productsQueries = {
    products: async() => {
        const products = await model.findAll({
            order:[['description','ASC']],
            raw:true,
        })
        return products
    },
    get: async({limit,offset,filters}) => {
        
        const where = {
            enabled: 1
        }

        if (filters.product_code) {
            where.product_code = {
                [Op.like]: `%${filters.product_code}%`
            }
        }

        if (filters.season) {
            where.season = {
                [Op.like]: `%${filters.season}%`
            }
        }

        const data = await model.findAndCountAll({
            include:[
                {
                    association:'product_colors',
                    include:[{association: 'color_data'}]
                },
                {
                    association:'product_sizes',
                    include:[{association: 'size_data'}]
                }
            ],
            where,
            limit,
            offset,
            nest:true
        })

        return data
    },
    seasonProducts: async(season) => {
        const products = await model.findAll({
            where:{
                season:season,
                enabled:1
            },
            include: [
                {association: 'product_fabric'},
                {association: 'product_type'},
                {
                    association: 'product_colors',
                    include: [{association: 'color_data'}]
                },
                {
                    association: 'product_sizes',
                    include: [{association: 'size_data'}]
                }
            ],
            order:[['product_code','ASC']],
            nest:true
        })
        return products
    },
    distinctProducts: async() => {
        const distinctProducts = await model.findAll({
            attributes: [[fn('DISTINCT', col('description')), 'description']],
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
        colors = colors.sort()

        //order by colors
        const specialColors = ['Blanco', 'Negro']
        const otherColors = colors.filter(color => !specialColors.includes(color))
        colors = [...specialColors, ...otherColors]

        const colorsOptions = {
            colors:colors
        }

        return colorsOptions
    },
    create: async(data) => {
        const newProduct = await model.create(data)
        return newProduct
    },
    update: async(data,idProduct) => {
        await model.update(
            data,
            {
                where:{
                    id:idProduct
                }
            }
        )
    },
    delete: async(id) => {
        await model.update(
            {
                enabled:0

            },
            {
                where:{
                    id:id
                }
            }
        )
    },
}       

module.exports = productsQueries