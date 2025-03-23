const moldsQueries = require('../../../dbQueries/cuttings/moldsQueries')
const cuttingsQueries = require('../../../dbQueries/cuttings/cuttingsQueries')
const layersQueries = require('../../../dbQueries/cuttings/layersQueries')

const cuttingsController = {
  // cuttings_molds
  getMolds: async(req,res) =>{
    try{

      const { page, size, mold, mold_string, description, order } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      // add filters
      if (mold) {
          filters.mold = mold
      }

      if (mold_string) {
        filters.mold_string = mold_string
      }

      if (description) {
        filters.description = description
      }

      if (order) {
        filters.order = JSON.parse(order)
      }

      // get data
      const data = await moldsQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // cuttings
  getCuttings: async(req,res) =>{
    try{

      const { page, size, cutting, mold_string, description, id_layers, order } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      // add filters
      if (cutting) {
          filters.cutting = cutting
      }

      if (mold_string) {
        filters.mold_string = mold_string
      }

      if (description) {
        filters.description = description
      }

      if (id_layers) {
        filters.id_layers = id_layers
    }

      if (order) {
        filters.order = JSON.parse(order)
      }

      // get data
      const data = await cuttingsQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  // cuttings_layers
  getLayers: async(req,res) =>{
    try{

      const { page, size, id_layers, order } = req.query
      const limit = size ? parseInt(size) : undefined
      const offset = page ? (parseInt(page) - 1) * limit : undefined
      const filters = {}
            
      // add filters
      if (id_layers) {
          filters.id_layers = id_layers
      }

      if (order) {
        filters.order = JSON.parse(order)
      }

      // get data
      const data = await layersQueries.get({ limit, offset, filters })

      //get pages
      const pages = Math.ceil(data.count / limit)
      data.pages = pages

      res.status(200).json(data)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = cuttingsController

