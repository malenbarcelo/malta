const bottomHeaderMenu = require("./bottomHeaderMenu")

const productsController = {
    molds: (req,res) => {
        try{
            const selectedItem = 'MOLDES'

            return res.render('cuttings/molds/molds',{title:'Moldes',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = productsController

