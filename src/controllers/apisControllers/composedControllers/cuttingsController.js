const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')

const cuttingsController = {    
    predictMolds: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()
            const limit = undefined
            const offset = undefined
            const filters = {mold_string: string}
            
            let data = await moldsQueries.get({ limit, offset, filters })
            
            res.status(200).json(data.rows)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    predictMoldsDescriptions: async(req,res) =>{
        try{
            const string = req.params.string.toLowerCase()
            const limit = undefined
            const offset = undefined
            const filters = {description: string}
            
            let data = await moldsQueries.get({ limit, offset, filters })
            
            res.status(200).json(data.rows)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    layersSummary: async(req,res) =>{
        try{
            const { id_cuttings, order } = req.query
            const filters = {}

            // add filters
            if (id_cuttings) {
                filters.id_cuttings = id_cuttings
            }

            if (order) {
                filters.order = JSON.parse(order)
            }

            // get data
            const data = await layersQueries.summary({ filters })
            
            res.status(200).json(data)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
    maxIdLayers: async(req,res) =>{
        try{
            
            // max id
            const data = await layersQueries.getMaxId()
            
            res.status(200).json(data)

        }catch(error){
        console.group(error)
        return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = cuttingsController


