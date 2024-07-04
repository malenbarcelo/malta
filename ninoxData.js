const ordersNinoxQueries = require('./src/controllers/dbQueries/sales/ordersNinoxQueries')
const { datesToGet,getNinoxData,getOrdersData } = require('./src/controllers/functions/ninoxCronFunctions')
//const data = require('./src/controllers/apisControllers/apisSalesData')

async function getDates() {
    try {

        //get last order data from orders_ninox
        const lastOrder = await ordersNinoxQueries.lastOrder()

        //get dates to add
        const {datesToGetArray,lastDateString} = await datesToGet(lastOrder)

        //get data from NINOX
        const ninoxData = []

        for (let i = 0; i < datesToGetArray.length; i++) {
            const data = await getNinoxData(datesToGetArray[i])
            if (datesToGetArray[i] == lastDateString) {
                const filterData = data.filter( d => parseInt(d.numeroFull.split("-")[1]) != lastOrder.order_number)
                filterData.forEach(element => {
                    ninoxData.push(element)
                })        
            }else{
                data.forEach(element => {
                    ninoxData.push(element
                    )
                })
            }
        }

        //configure data to add to database
        const ordersData = await getOrdersData(ninoxData)

        //save data in orders_ninox
        await ordersNinoxQueries.saveOrders(ordersData)

    } catch (error) {
        console.error('Error al obtener las fechas:', error)
    }
}

getDates()