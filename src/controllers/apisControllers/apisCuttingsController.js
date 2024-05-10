
const productsQueries = require('../dbQueries/productsQueries')

const apisCuttingsController = {
  productOptions: async(req,res) =>{
    try{

      const productDescription = req.params.productDescription

      const productOptions = await productsQueries.productOptions(productDescription)      

      res.status(200).json(productOptions)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisCuttingsController

