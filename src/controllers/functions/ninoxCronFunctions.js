const customersQueries = require('../dbQueries/data/customersQueries')
const productsQueries = require('../dbQueries/cuttings/productsQueries')
const ordersNinoxQueries = require('../dbQueries/sales/ordersNinoxQueries')
const paymentMethodsQueries = require('../dbQueries/data/paymentMethodsQueries')
const { addOneDay,getDateString } = require('./generalFunctions')

const ninoxCronFunctions = {
    datesToGet: async(lastOrder) => {

        //get last date
        const lastDate = lastOrder.date

        //get dates in string format
        const dateToday = new Date()
        const dateTodayString = getDateString(dateToday)

        //get dates to get from ninox
        let datesToGetArray = []
        const lastDateArray = lastDate.split('-')
        const lastDateString = lastDateArray[2] + '/' + lastDateArray[1] + '/' + lastDateArray[0]
        let newDate = lastDateString

        do {
            datesToGetArray.push(newDate)
            newDate = addOneDay(newDate)
            
        } while (newDate != dateTodayString)

        datesToGetArray.push(dateTodayString)

        return {datesToGetArray,lastDateString}
    },
    getNinoxData: async(date) => {

        //get ninox sales from API
        const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
        url.searchParams.append('fecha', date)
        url.searchParams.append('sucursalId', 1)
        url.searchParams.append('incluirMediosPago', true)

        const headers = {
            'Content-Type': 'application/json',
            'X-NX-TOKEN': 'bl9f6RQBLfq6JDDtFzWZFCtddlxxtIsR'
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()

        return data
    },
    getNinoxMonthData: async(month,year) => {

        //get ninox sales from API
        const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
        url.searchParams.append('mes', month)
        url.searchParams.append('anio', year)
        url.searchParams.append('sucursalId', 1)
        url.searchParams.append('incluirMediosPago', true)

        const headers = {
            'Content-Type': 'application/json',
            'X-NX-TOKEN': 'bl9f6RQBLfq6JDDtFzWZFCtddlxxtIsR'
        }

        const response = await fetch(url, {
            method: 'GET',
            headers: headers
        })

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json()

        return data
    },
    getOrdersData: async(ninoxData) => {

        //get aditional data
        const customers = await customersQueries.customers()
        const products = await productsQueries.products()
        const paymentMethods = await paymentMethodsQueries.paymentMethods()
        const idsInvoices = ninoxData.map(ninoxData => ninoxData.facturaId)//get invoices ids
        const idsInvoicesUnique = [...new Set(idsInvoices)]
        const ordersData = []

        //complete data for sales_orders_ninox and sales_payments_ninox
        idsInvoicesUnique.forEach(id => {
            const allRows = ninoxData.filter(d => d.facturaId == id)
            const date = allRows[0].fechaText
            const customerName = allRows[0].cliente
            const idCustomers = customers.filter(c => c.customer_name == customerName)[0]
            const subtotal = allRows.reduce((sum, row) => sum + (row.precioVentaFinal * row.cantidad), 0)
            const orderNumber = parseInt(allRows[0].numeroFull.split("-")[1])
            const paymentMethod = allRows[0].formasPagoText
            const idPaymentsMethods = paymentMethods.filter(p => p.payment_method == paymentMethod)[0]
            
            ordersData.push({
                numeroFull:allRows[0].numeroFull,
                date:date,
                order_number:orderNumber,
                customer_name:customerName,
                id_customers: idCustomers ? idCustomers.id : null,
                subtotal: subtotal,
                discount:0,
                total:subtotal,
                id_orders_status:3,
                id_payments_status:5,
                id_orders_managers:1,
                obervations:'',
                payment_method:paymentMethod,
                id_payments_methods:idPaymentsMethods ? idPaymentsMethods.id : null,
                enabled:1
            })        
        })

        //complete order details
        for (let i = 0; i < ordersData.length; i++) {
            const allRows = ninoxData.filter(d => d.numeroFull == ordersData[i].numeroFull)
            const orderDetails = []

            for (let j = 0; j < allRows.length; j++) {
                const findProduct = products.filter(p => p.description == allRows[j].descripcion)[0]
                const productId = findProduct ? findProduct.id : null                    

                orderDetails.push({
                    description:allRows[j].descripcion,
                    id_products:productId,
                    color:allRows[j].color,
                    size:allRows[j].talle,
                    unit_price:allRows[j].precioVentaFinal,
                    required_quantity:allRows[j].cantidad,
                    confirmed_quantity:allRows[j].cantidad,
                    extended_price:allRows[j].cantidad * allRows[j].precioVentaFinal
                })                    
            }

            ordersData[i].orderDetails = orderDetails
        }

        return ordersData
        
    }

}
        

module.exports = ninoxCronFunctions
