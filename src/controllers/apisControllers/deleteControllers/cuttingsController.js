
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')

const cuttingsController = {
   // cuttings_layers
   deleteLayers: async(req,res) =>{
    try{

      const idLayers = req.body.idLayers

      console.log(idLayers)

      // edit cuttings
      await layersQueries.destroy(idLayers)

      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
}
module.exports = cuttingsController

