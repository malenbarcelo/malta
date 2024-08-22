
const productsQueries = require('../dbQueries/cuttings/productsQueries')

const apisCuttingsController = {
  productOptions: async(req,res) =>{
    try{

      const productDescription = req.body.productDescription

      const productOptions = await productsQueries.productOptions(productDescription)

      res.status(200).json(productOptions)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  sizeOptions: async(req,res) =>{
    try{

      const productDescription = req.body.productDescription
      const color = req.body.color

      const sizesOptions = await productsQueries.sizesOptions(productDescription,color)      

      res.status(200).json(sizesOptions)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  colorOptions: async(req,res) =>{
    try{

      const productDescription = req.body.selectedProduct
      const size = req.body.size

      const colorsOptions = await productsQueries.colorsOptions(productDescription,size)

      res.status(200).json(colorsOptions)

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
}
module.exports = apisCuttingsController

