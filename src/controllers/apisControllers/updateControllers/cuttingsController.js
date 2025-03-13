const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')

const moldsController = {
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

