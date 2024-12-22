const wpPostsQueries = require('../dbQueries/sales/wpPostsQueries')
const wpPostmetaQueries = require('../dbQueries/sales/wpPostmetaQueries')
const wpOrderItemsQueries = require('../dbQueries/sales/wpOrderItemsQueries')
const wpOrderItemmetaQueries = require('../dbQueries/sales/wpOrderItemmetaQueries')

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
    const dataToSave = monthWpPosts.map(mp => ({
        ID: mp.ID,
        post_date: mp.post_date,
        post_status: mp.post_status,
        post_type: mp.post_status,
        month: month,
        year: year
    }))

    //compare posts
    const newPosts = dataToSave.filter(dts => !monthPostsIds.includes(dts.ID))

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

    console.log(monthWpPostmeta)

    // const dataToSave = monthWpPostmeta.map(mp => ({
    //     ID: mp.ID,
    //     post_date: mp.post_date,
    //     post_status: mp.post_status,
    //     post_type: mp.post_status,
    //     month: month,
    //     year: year
    // }))

    // //compare posts
    // const newPostmeta = monthWpPostmeta.filter(p => !monthPostmetaIds.includes(parseInt(p.post_id)))

    // //save new posts in sales_wp_posts
    // await wpPostmetaQueries.createPostmeta(newPostmeta,month,year)
}

async function getNewOrderItems(month, year) {

    //get order_items from database
    //const monthOrderItems = await wpOrderItemsQueries.monthOrderItems(month,year)
    //const monthOrderItemsIds = monthOrderItems.map(oi => oi.order_id)

    //get month order items from wordpress
    // const url = 'https://maltachic.com.ar/webOrderItems.php'
    // const response = await fetch(url)
    // if (!response.ok) {
    //     throw new Error(`HTTP error! Status: ${response.status}`);
    // }  
    // const monthWpOredrItems = await response.json()

    // console.log(monthWpOredrItems)

//     //compare posts
//     const newOrderItems = monthWpOredrItems.filter(oi => !monthOrderItemsIds.includes(parseInt(oi.order_id)))

//     //save new posts in sales_wp_order_items
//     await wpOrderItemsQueries.createOrderItem(newOrderItems,month,year)
}

async function getNewOrderItemmeta(month, year) {

//     //get order_items from database
//     const monthOrderItemmeta = await wpOrderItemmetaQueries.monthOrderItemmeta(month,year)
//     const monthOrderItemmetaIds = monthOrderItemmeta.map(oi => oi.meta_id)

//     //get month order items from wordpress
//     const url = 'https://maltachic.com.ar/webOrderItemmeta.php'
//     const response = await fetch(url)
//     if (!response.ok) {
//     throw new Error(`HTTP error! Status: ${response.status}`);
//     }  
//     const monthWpOrderItemmeta = await response.json()

//     //compare posts
//     const newOrderItemmeta = monthWpOrderItemmeta.filter(oi => !monthOrderItemmetaIds.includes(parseInt(oi.meta_id)))

//     //save new posts in sales_wp_order_items
//     await wpOrderItemmetaQueries.createOrderItemmeta(newOrderItemmeta,month,year)
}

module.exports = {getNewPosts,getNewPostmeta,getNewOrderItems,getNewOrderItemmeta}
