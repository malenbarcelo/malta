const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const cuttingsQueries = require('../../../dbQueries/cuttings/cuttingsQueries')

const moldsController = {
   // cuttings
   updateCuttings: async(req,res) =>{
    try{

      const data = req.body

      // edit cuttings
      await cuttingsQueries.update(data)

      res.json({message:'ok'})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
  // cuttings_molds
  updateMolds: async(req,res) =>{
    try{

      const data = [{
        ...req.body,
        units_per_layer: req.body.units_per_layer ? req.body.units_per_layer : null,
      }]

      if (req.file) {
        data[0].image = req.file.filename
      }

      // edit molds
      await moldsQueries.update(data)

      res.json({message:'ok',data:data})

    }catch(error){
      console.log(error)
      res.json({message:'error'})
    }
  },
}
module.exports = moldsController

