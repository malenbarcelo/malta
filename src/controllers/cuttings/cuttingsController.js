const bottomHeaderMenu = require("./bottomHeaderMenu")

const cuttingsController = {
    cuttings: (req,res) => {
        try{
            const selectedItem = 'CORTES'

            return res.render('cuttings/cuttings/cuttings',{title:'Cortes',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = cuttingsController

