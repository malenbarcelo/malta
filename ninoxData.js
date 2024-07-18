const ordersNinoxQueries = require('./src/controllers/dbQueries/sales/ordersNinoxQueries')
const ordersNinoxDetailsQueries = require('./src/controllers/dbQueries/sales/ordersNinoxDetailsQueries')
const paymentsNinoxQueries = require('./src/controllers/dbQueries/sales/paymentsNinoxQueries')
const { datesToGet,getOrdersData,getNinoxMonthData} = require('./src/controllers/functions/ninoxCronFunctions')
//const ninoxMonthData = require('./src/controllers/apisControllers/apisSalesData')

async function getNinoxData() {
    try {

        const date = new Date()
        const options = {
            timeZone: 'America/Argentina/Buenos_Aires',
            hour12: false,
        };

        const localDateTime = date.toLocaleString('es-AR', options)
        const localDate = localDateTime.split(',')[0]
        const month = parseInt(localDate.split('/')[1])
        const year =  parseInt(localDate.split('/')[2])

        // const month = 7
        // const year = 2024
        
        //get data from ninox
        const ninoxMonthData = await getNinoxMonthData(month,year)

        //get last order data from orders_ninox
        const monthOrders = await ordersNinoxQueries.monthOrders(month, year)
        const monthOrdersNumbers = monthOrders.map(order => order.order_number)

        //filter ninoxData
        const dataToAdd = monthOrdersNumbers.length == 0 ? ninoxMonthData : ninoxMonthData.filter(d => !monthOrdersNumbers.includes(parseInt(d.numeroFull.split("-")[1])));

        //configure data to add to database
        const ordersData = await getOrdersData(dataToAdd)

        //save data in orders_ninox
        await ordersNinoxQueries.saveOrders(ordersData)

        //save payments in payments_ninox
        for (let i = 0; i < ordersData.length; i++) {                
            //get order id
            const orderId = await ordersNinoxQueries.getOrder(ordersData[i].order_number)
            await paymentsNinoxQueries.registerOrderPayment(ordersData[i],orderId)
        }

        //save orders_details
        for (let i = 0; i < ordersData.length; i++) {                
            //get order id
            const orderId = await ordersNinoxQueries.getOrder(ordersData[i].order_number)
            await ordersNinoxDetailsQueries.saveOrderDetails(ordersData[i].orderDetails,orderId)
        }

    } catch (error) {
        console.error('Error al obtener las fechas:', error)
    }
}

getNinoxData()