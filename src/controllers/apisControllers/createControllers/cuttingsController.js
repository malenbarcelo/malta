
const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const cuttingsQueries = require('../../../dbQueries/cuttings/cuttingsQueries')
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')

const cuttingsController = {
  // cuttings
  createCuttings: async(req,res) =>{
    try{

      const data = req.body

      // create cuttings
      const newData = await cuttingsQueries.create(data)
      
      res.json({message:'ok',data:newData})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // cuttings_molds
  createMolds: async(req,res) =>{
    try{

      const data = [{
        ...req.body,
        enabled: 1,
        units_per_layer: req.body.units_per_layer ? req.body.units_per_layer : null,
        image: req.file ? req.file.filename : null
      }]

      // create molds
      const newData = await moldsQueries.create(data)

      res.json({message:'ok',data:newData})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // cuttings_layers
  createLayers: async(req,res) =>{
    try{

      const data = req.body

      // create layers
      const newData = await layersQueries.create(data)
      
      res.json({message:'ok',data:newData})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
}
module.exports = cuttingsController

