const wpPostsQueries = require('../dbQueries/sales/wpPostsQueries')
const wpPostmetaQueries = require('../dbQueries/sales/wpPostmetaQueries')
const wpOrderItemsQueries = require('../dbQueries/sales/wpOrderItemsQueries')
const wpOrderItemmetaQueries = require('../dbQueries/sales/wpOrderItemmetaQueries')

const seasonQueries = require('../dbQueries/main/seasonsQueries')
const ordersWpQueries = require('../dbQueries/sales/ordersWpQueries')
const ordersDetailsWpQueries = require('../dbQueries/sales/ordersDetailsWpQueries')
const productsQueries = require('../dbQueries/cuttings/productsQueries')


async function getNewPosts(month,year) {

    //get max id
    const maxId = await wpPostsQueries.getMaxId()

    //get month posts from wordpress
    const url = 'https://maltachic.com.ar/webPosts.php'
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthPosts = await response.json()

    const newPosts = monthPosts.filter(mp => parseInt(mp.ID) > (maxId == null ? 0 : parseInt(maxId.ID)))

    const dataToSave = newPosts.map(np => ({
        ID: np.ID,
        post_date: np.post_date,
        post_status: np.post_status,
        post_type: np.post_status,
        month: month,
        year: year
    }))

    //save new posts in sales_wp_posts
    await wpPostsQueries.createPosts(dataToSave)
    
}

async function getNewPostmeta(month,year) {

    //get max id
    const maxId = await wpPostmetaQueries.getMaxId()

    //get month postmeta from wordpress
    const url = 'https://maltachic.com.ar/webPostmeta.php'
    const response = await fetch(url)
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthPostmeta = await response.json()

    const newPostmeta = monthPostmeta.filter(mp => parseInt(mp.meta_id) > (maxId == null ? 0 : parseInt(maxId.meta_id)))

    const dataToSave = newPostmeta.map(np => ({
        meta_id: np.meta_id,
        post_id: np.post_id,
        meta_key: np.meta_key,
        meta_value: np.meta_value,
        month: month,
        year: year
    }))

    //save new posts in sales_wp_posts
    await wpPostmetaQueries.createPostmeta(dataToSave)
}

async function getNewOrderItems(month, year) {

    //get max id
    const maxId = await wpOrderItemsQueries.getMaxId()

    //get month order items from wordpress
    const url = 'https://maltachic.com.ar/webOrderItems.php'
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthOrderItems = await response.json()

    const newOrderItems = monthOrderItems.filter(mo => parseInt(mo.order_item_id) > (maxId == null ? 0 : parseInt(maxId.order_item_id)))

    const dataToSave = newOrderItems.map(no => ({
        order_item_id: no.order_item_id,
        order_item_name: no.order_item_name,
        order_item_type: no.order_item_type,
        order_id: no.order_id,
        month: month,
        year: year
    }))

    //save new posts in sales_wp_order_items
    await wpOrderItemsQueries.createOrderItem(dataToSave)
}

async function getNewOrderItemmeta(month, year) {

    //get max id
    const maxId = await wpOrderItemmetaQueries.getMaxId()

    //get month order items from wordpress
    const url = 'https://maltachic.com.ar/webOrderItemmeta.php'
    const response = await fetch(url)
    if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
    }  
    const monthOrderItemmeta = await response.json()

    const newOrderItemmeta = monthOrderItemmeta.filter(mo => parseInt(mo.meta_id) > (maxId == null ? 0 : parseInt(maxId.meta_id)))

    const dataToSave = newOrderItemmeta.map(no => ({
        meta_id: no.meta_id,
        order_item_id: no.order_item_id,
        meta_key: no.meta_key,
        meta_value: no.meta_value,
        month: month,
        year: year
    }))

    //save new posts in sales_wp_order_items
    await wpOrderItemmetaQueries.createOrderItemmeta(dataToSave)
}

async function saveNewOrders() {

    //get current season
    const season = await seasonQueries.currentSeason()

    //get max post_id from sales_orders_wp
    const maxId = await ordersWpQueries.getMaxId()

    //get posts and postmeta to save
    const firstPostId = maxId == null ? 0 : (maxId.post_id + 1)
    const postsToSave = await wpPostsQueries.getPostsToSave(firstPostId)
    const postmetaToSave = await wpPostmetaQueries.getPostsToSave(firstPostId)
    const orderNumbersToSave = postmetaToSave.filter(pts => pts.meta_key == '_order_number')
    const paymentMethodsToSave = postmetaToSave.filter(pts => pts.meta_key == '_payment_method_title')
    const firstNamesToSave = postmetaToSave.filter(pts => pts.meta_key == '_billing_first_name')
    const lastNamesToSave = postmetaToSave.filter(pts => pts.meta_key == '_billing_last_name')

    //orderNumbersToSave
    const mapOrders = new Map(orderNumbersToSave.map(o => [o.post_id, o]))

    let mergedArray = postsToSave.map(p => {

        let date = new Date(p.post_date)
        date.setHours(date.getHours() + 3);
    
        return {
            ...p,
            date: date,
            order_number: parseInt(mapOrders.get(p.post_id)?.meta_value) || null
        }
    })

    //paymentMethodsToSave
    const mapPayments = new Map(paymentMethodsToSave.map(p => [p.post_id, p]))

    mergedArray = mergedArray.map(m => ({
        ...m,
        payment_method: mapPayments.get(m.post_id)?.meta_value || null
    }))

    //fistNamesToSave
    const mapFirstNames = new Map(firstNamesToSave.map(f => [f.post_id, f]))

    mergedArray = mergedArray.map(m => ({
        ...m,
        first_name: mapFirstNames.get(m.post_id)?.meta_value || null
    }))

    //lastNamesToSave
    const mapLastNames = new Map(lastNamesToSave.map(l => [l.post_id, l]))

    mergedArray = mergedArray.map(m => ({
        ...m,
        last_name: mapLastNames.get(m.post_id)?.meta_value || null
    }))

    //customer
    mergedArray = mergedArray.map(m => ({
        ...m,
        customer: m.first_name  + ' ' + m.last_name
    }))

    //get orders details to save
    const detailsToSave = await wpOrderItemsQueries.getDataToSave(firstPostId)
    const itemDetailsToSave = detailsToSave.filter(dts => dts.order_item_type == 'line_item')
    const costDetailsToSave = detailsToSave.filter(dts => dts.order_item_type == 'shipping')
    const feeDetailsToSave = detailsToSave.filter(dts => dts.order_item_type == 'fee')

    //merge itemDetailsToSave
    const sumItemDetails = itemDetailsToSave.reduce((map, i) => {
        map.set(i.post_id, (map.get(i.post_id) || 0) + parseFloat(i.total));
        return map;
      }, new Map());

    mergedArray = mergedArray.map(i => ({
        ...i,
        subtotal: sumItemDetails.get(i.post_id) || 0
    }));

    //merge costDetailsToSave
    const sumCostDetails = costDetailsToSave.reduce((map, i) => {
        map.set(i.post_id, (map.get(i.post_id) || 0) + parseFloat(i.shipping));
        return map;
      }, new Map());

    mergedArray = mergedArray.map(i => ({
        ...i,
        shipping: sumCostDetails.get(i.post_id) || 0
    }));

    //merge feeDetailsToSave
    const sumFeeDetails = feeDetailsToSave.reduce((map, i) => {
        map.set(i.post_id, (map.get(i.post_id) || 0) + parseFloat(i.total));
        return map;
      }, new Map());

    mergedArray = mergedArray.map(i => ({
        ...i,
        fee: sumFeeDetails.get(i.post_id) || 0
    }));

    //additional data
    mergedArray = mergedArray.map(m => ({
        ...m,
        id_sales_channels:3,
        id_orders_status: 1,
        season:season.season,
        total: m.subtotal + m.shipping + m.fee,
        id_payments_status: m.payment_method == 'EFECTIVO EN EL LOCAL' ? 3 : 1,
        enabled:1
    }))

    //save data in database
    const newOrders = await ordersWpQueries.create(mergedArray)

    return { newOrders, itemDetailsToSave}
    
}

async function saveNewOrdersDetails(orders, ordersdetails) {

    //get current season
    const season = await seasonQueries.currentSeason()

    //get season products
    let products = await productsQueries.seasonProducts(season.season)
    products = products.map(p => p.get({ plain: true }))

    //orderNumbersToSave
    const mapOrders = new Map(orders.map((item) => [item.post_id, item.id]))
    const mapProducts = new Map(products.map((item) => [item.product_code, item.id]))

    let mergedArray = ordersdetails.map(item => ({
        id_orders: parseInt(mapOrders.get(item.post_id)) || null,
        id_products:parseInt(mapProducts.get(item.order_item_name.split(' - ')[0])) || null,
        description: item.order_item_name.split('<span> - </span>')[0],
        color: item.color || '',
        size: item.size || 'U',
        unit_price: parseFloat(item.total) / parseInt(item.quantity),
        quantity: parseInt(item.quantity),
        extended_price: parseFloat(item.total),
        enabled:1,
    }))

    //save data
    await ordersDetailsWpQueries.create(mergedArray)
    
}

module.exports = {getNewPosts,getNewPostmeta,getNewOrderItems,getNewOrderItemmeta, saveNewOrders, saveNewOrdersDetails}
