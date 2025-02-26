const bottomHeaderMenu = require("./bottomHeaderMenu")
const productsQueries = require("../../dbQueries/cuttings/productsQueries")
const productsSizesQueries = require("../../dbQueries/cuttings/productsSizesQueries")
const productsColorsQueries = require("../../dbQueries/cuttings/productsColorsQueries")
const dominio = require("../dominio")

const productsController = {
    ////BACKEND
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
            const season = await (await fetch(`${dominio}apis/main/current-season`)).json()
            let filters = `product_code=${req.body.product.product_code}&season=${season.season}`
            
            const product = req.body.product
            let sizes = req.body.sizes
            let colors = req.body.colors
            
            //findout if product has already been created (for doubleclick errors)
            const existingProduct = await (await fetch(`${dominio}apis/get/cuttings-products?${filters}`)).json()

            if (existingProduct.rows.length > 0) {
                return res.status(400).json({ error: 'El producto ya existe' })
            }

            //create products
            const newProduct = await productsQueries.create(product)

            //create products sizes
            sizes = sizes.map(size => ({id_products: newProduct.id,id_sizes: size.id}))
            await productsSizesQueries.bulkCreate(sizes)

            //create products colors
            colors = colors.map(color => ({id_products: newProduct.id,id_colors: color.id}))
            await productsColorsQueries.bulkCreate(colors)
            
            return res.json({ success: true, product: newProduct })

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    editProduct: async(req,res) => {
        try{

            const newData = req.body.productData
            const idProduct = req.body.idProduct
            let sizes = req.body.sizes
            let colors = req.body.colors

            //update products
            await productsQueries.update(newData,idProduct)

            //delete products sizes
            await productsSizesQueries.delete(idProduct)

            //create products sizes
            sizes = sizes.map(size => ({id_products: idProduct,id_sizes: size.size_data.id}))
            await productsSizesQueries.bulkCreate(sizes)

            //delete products colors
            await productsColorsQueries.delete(idProduct)

            //create products colors
            colors = colors.map(color => ({id_products: idProduct,id_colors: color.color_data.id}))
            await productsColorsQueries.bulkCreate(colors)
            
            res.status(200).json()

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    deleteProduct: async(req,res) => {
        try{

            const id = req.body.id

            console.log(req.body)

            //delete product
            await productsQueries.delete(id)

            res.status(200).json()

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    seasonProducts: async(req,res) => {
        try{
            
            const season = req.params.season

            console.log(season)

            //get products
            const products = await productsQueries.seasonProducts(season)

            res.status(200).json(products)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    predictSeasonDescriptions: async(req,res) =>{
        try{

            const season = req.params.season
            const string = req.params.string.toLowerCase()

            //get products
            const products = await productsQueries.seasonProducts(season)
        
            const predictedDescriptions = products.filter(p => p.full_description.toLowerCase().includes(string))
        
            res.status(200).json(predictedDescriptions)
    
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
    predictSeasonProducts: async(req,res) =>{
        try{

            const season = req.params.season
            const string = req.params.string.toLowerCase()
        
            //get products
            const products = await productsQueries.seasonProducts(season)
        
            const predictedProducts = products.filter(p => p.full_description.toLowerCase().includes(string))
        
            res.status(200).json(predictedProducts)
    
        }catch(error){
          console.log(error)
          return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = productsController

