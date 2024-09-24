const bottomHeaderMenu = require("./bottomHeaderMenu")
const productsQueries = require("../dbQueries/cuttings/productsQueries")
const productsSizesQueries = require("../dbQueries/cuttings/productsSizesQueries")
//const productsColorsQueries = require("../dbQueries/cuttings/productsColorsQueries")

const productsController = {
    products: (req,res) => {
        try{
            const selectedItem = 'PRODUCTOS'

            return res.render('cuttings/products/products',{title:'Productos',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    ////APIS
    createProduct: async(req,res) => {
        try{
            const product = req.body.product
            let sizes = req.body.sizes
            let colors = req.body.colors
            

            //create products
            const newProduct = await productsQueries.create(product)

            //create products sizes
            sizes = sizes.map(size => ({id_products: newProduct.id,id_sizes: size.id}))
            await productsSizesQueries.bulkCreate(sizes)

            //create products colors
            //await productsColorsQueries.create(data)


            
            res.status(200).json()

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = productsController

