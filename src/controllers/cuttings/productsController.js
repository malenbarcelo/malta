const bottomHeaderMenu = require("./bottomHeaderMenu")

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
}

module.exports = productsController

