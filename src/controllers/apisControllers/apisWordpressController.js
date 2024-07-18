const wpPostsQueries = require('../dbQueries/sales/wpPostsQueries')
const {getNewPosts,getNewPostmeta,getNewOrderItems} = require('../functions/salesWpFuntions')

const apisWordpressController = {
  newOrdersData: async(req,res) => {
    try{

      //get Arg date
      const date = new Date()
      date.setUTCHours(date.getUTCHours() - 3)
      const year = date.getFullYear()
      const month = date.getMonth() + 1
      
      //get new posts from wordpress and save data in sales_wp_posts
      await getNewPosts(month,year)

      //get new postmeta from wordpress and save data in sales_wp_postmeta
      await getNewPostmeta(month,year)

      //get new order items from wordpress and save data in sales_wp_order_items
      await getNewOrderItems(month,year)



      

      res.status(200).json({message:'hola'})

      


      // //get order_items
      // const url3 = 'https://maltachic.com.ar/webOrderItems.php'
      // const response3 = await fetch(url3)
      // if (!response3.ok) {
      //   throw new Error(`HTTP error! Status: ${response3.status}`);
      // }  
      // const data = await response3.json()


  //     //get order_items
  //     const url4 = 'https://maltachic.com.ar/webOrderItemmeta.php'
  //     const response4 = await fetch(url4)
  //     if (!response4.ok) {
  //       throw new Error(`HTTP error! Status: ${response4.status}`);
  //     }  
  //     const data = await response4.json()

  //     const data2 = data.slice(0,100)






  //     console.log(data.length)





      


    }catch(error){

        console.log(error)
        return res.send('Ha ocurrido un error')
    }
  },





  
  // getNewOrders: async(req,res) =>{
  //   try{

  //     //get last date copied in wp_posts_copied
  //     const lastID = await wpPostsCopiedQueries.lastID()

  //     //get wp_posts data from last_id
  //     const wpPostsMissing = await wpQueries.wpPostsMissing(lastID)

  //     //add wp_posts to wp_posts_copied
  //     await wpPostsCopiedQueries.addNewPosts(wpPostsMissing)

  //     //get array with posts_IDs
  //     const postsIDs = wpPostsMissing.map(w => w.ID)

  //     //find orders_numbers
  //     const orders = await wpQueries.wpPostmetaFindOrders(postsIDs)

  //     //insert orders number in wp_postmet_copied
  //     await wpPostsCopiedQueries.addNewOrders(orders)

  //     //get web_orders
  //     const newWebOrders = await wpPostsCopiedQueries.getNewWebOrders(postsIDs)


  //     // //get array with orders_numbers
  //     // const ordersNumbers = orders.map(o => o.meta_id)

  //     res.status(200).json(newWebOrders)

  //     //res.status(200).json('Datos creados con éxito')

  //   }catch(error){
  //     console.group(error)
  //     return res.send('Ha ocurrido un error')
  //   }
  // },
  // getWpPostss: async(req,res) => {
  //   try{

  //     const url = 'https://maltachic.com.ar/wp-json/miapi/v1/hola-mundo'; 
  //     const token = 'mi-token-secreto'

  //     const headers = {
  //       'Authorization': token
  //     };

  //     const response = await fetch(url, {
  //       method: 'GET',
  //       headers: headers
  //     });

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! Status: ${response.status}`);
  //     }
  
  //     const data = await response.json()

    //   res.status(200).json(data)


    // }catch(error){

    //     console.log(error)
    //     return res.send('Ha ocurrido un error')
    // }
//},

  

}
module.exports = apisWordpressController

