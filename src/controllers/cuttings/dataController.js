const bottomHeaderMenu = require("./bottomHeaderMenu")
const productsTypesQueries = require("../dbQueries/cuttings/productsTypesQueries")
const fabricsQueries = require("../dbQueries/cuttings/fabricsQueries")
const colorsQueries = require("../dbQueries/cuttings/colorsQueries")
const sizesQueries = require("../dbQueries/cuttings/sizesQueries")

const productsController = {
    data: (req,res) => {
        try{
            const selectedItem = 'DATOS'

            return res.render('cuttings/data/data',{title:'Datos',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    /////////APIS//////////
    productsTypes: async(req,res) => {
        try{
            const data = await productsTypesQueries.allData()

            res.status(200).json(data)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    fabrics: async(req,res) => {
        try{
            const data = await fabricsQueries.allData()

            res.status(200).json(data)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    colors: async(req,res) => {
        try{
            const data = await colorsQueries.allData()

            res.status(200).json(data)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    sizes: async(req,res) => {
        try{
            const data = await sizesQueries.allData()

            res.status(200).json(data)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    deleteData: async(req,res) => {
        try{
            const data = req.body

            if (data.table == 'productsTypes') {
                await productsTypesQueries.delete(data.id)
            }

            if (data.table == 'fabrics') {
                await fabricsQueries.delete(data.id)
            }

            if (data.table == 'colors') {
                await colorsQueries.delete(data.id)
            }

            if (data.table == 'sizes') {
                await sizesQueries.delete(data.id)
            }

            console.log(data)
            res.status(200).json()

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = productsController

