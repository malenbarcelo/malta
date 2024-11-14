const bottomHeaderMenu = require("../sales/bottomHeaderMenu")

const shippingController = {
  ////BACKEND
  shipping: (req,res) => {
    try{
        const selectedItem = 'SEGUIMIENTO'

        return res.render('sales/shipping/shipping',{title:'Seguimiento',bottomHeaderMenu,selectedItem})

    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
},
  //////APIS//////
}

module.exports = shippingController

