const {validationResult} = require('express-validator')
const seasonsQueries = require('../dbQueries/main/seasonsQueries')

const mainController = {
    currentSeason: async(req,res) => {
        try{

            const currentSeason = await seasonsQueries.currentSeason()

            res.status(200).json(currentSeason)

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    newSeason: async(req,res) => {
        try{

            const season = req.body.season
            const idUser = req.session.userLogged.id
            await seasonsQueries.create(season,idUser)

            res.status(200).json()

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    
}

module.exports = mainController

