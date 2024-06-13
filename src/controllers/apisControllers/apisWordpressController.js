
const wpQueries = require('../dbQueries/wpQueries')
const wpPostsCopiedQueries = require('../dbQueries/wpPostsCopiedQueries')

const apisWordpressController = {
  getNewOrders: async(req,res) =>{
    try{

      //get last date copied in wp_posts_copied
      const lastID = await wpPostsCopiedQueries.lastID()

      //get wp_posts data from last_id
      const wpPostsMissing = await wpQueries.wpPostsMissing(lastID)

      //add wp_posts to wp_posts_copied
      await wpPostsCopiedQueries.addNewPosts(wpPostsMissing)

      //get array with posts_IDs
      const postsIDs = wpPostsMissing.map(w => w.ID)

      //find orders_numbers
      const orders = await wpQueries.wpPostmetaFindOrders(postsIDs)

      //insert orders number in wp_postmet_copied
      await wpPostsCopiedQueries.addNewOrders(orders)

      //get web_orders
      const newWebOrders = await wpPostsCopiedQueries.getNewWebOrders(postsIDs)


      // //get array with orders_numbers
      // const ordersNumbers = orders.map(o => o.meta_id)

      res.status(200).json(newWebOrders)

      //res.status(200).json('Datos creados con éxito')

    }catch(error){
      console.group(error)
      return res.send('Ha ocurrido un error')
    }
  },
  getWpPostss: async(req,res) => {
    try{

      const url = 'https://maltachic.com.ar/wp-json/miapi/v1/hola-mundo'; 
      const token = 'mi-token-secreto'

      const headers = {
        'Authorization': token
      };

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json()

      res.status(200).json(data)


    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
},

  getWpPosts: async(req,res) => {
    try{

      const url = 'https://maltachic.com.ar/wp-json/miapi/v1/get-wp-posts?id_min=6390'; 
      const token = 'mi-token-secreto'

      const headers = {
        'Authorization': token
      };

      const response = await fetch(url, {
        method: 'GET',
        headers: headers
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
  
      const data = await response.json()

      res.status(200).json(data)


    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
},


}
module.exports = apisWordpressController

