const wpPostsQueries = require('../dbQueries/sales/wpPostsQueries')
const wpPostmetaQueries = require('../dbQueries/sales/wpPostmetaQueries')
const wpOrderItemsQueries = require('../dbQueries/sales/wpOrderItemsQueries')

async function getNewPosts(month,year) {

    //get month posts from database
    const monthPosts = await wpPostsQueries.monthPosts(month,year)
    const monthPostsIds = monthPosts.map(mp => mp.ID)

    //get month posts from wordpress
    const url = 'https://maltachic.com.ar/webPosts.php'
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthWpPosts = await response.json()

    //compare posts
    const newPosts = monthWpPosts.filter(p => !monthPostsIds.includes(p.ID))

    //save new posts in sales_wp_posts
    await wpPostsQueries.createPosts(newPosts)
    
}

async function getNewPostmeta(month,year) {

    //get postdata from database
    const monthPostmeta = await wpPostmetaQueries.monthPostmeta(month,year)
    const monthPostmetaIds = monthPostmeta.map(mp => mp.post_id)

    //get month postmeta from wordpress
    const url = 'https://maltachic.com.ar/webPostmeta.php'
    const response = await fetch(url)
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthWpPostmeta = await response.json()

    //compare posts
    const newPostmeta = monthWpPostmeta.filter(p => !monthPostmetaIds.includes(parseInt(p.post_id)))

    //save new posts in sales_wp_posts
    await wpPostmetaQueries.createPostmeta(newPostmeta,month,year)
}

async function getNewOrderItems(month, year) {

    //get order_items from database
    const monthOrderItems = await wpOrderItemsQueries.monthOrderItems(month,year)
    const monthOrderItemsIds = monthOrderItems.map(oi => oi.order_id)

    //get month order items from wordpress
    const url = 'https://maltachic.com.ar/webOrderItems.php'
    const response = await fetch(url)
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthWpOredrItems = await response.json()

    //compare posts
    const newOrderItems = monthWpOredrItems.filter(oi => !monthOrderItemsIds.includes(parseInt(oi.order_id)))

    //save new posts in sales_wp_order_items
    await wpOrderItemsQueries.createOrderItem(newOrderItems,month,year)
}
module.exports = {getNewPosts,getNewPostmeta,getNewOrderItems}
