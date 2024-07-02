const customersQueries = require('./dbQueries/data/customersQueries')
const productsQueries = require('./dbQueries/cuttings/productsQueries')
const paymentMethodsQueries = require('./dbQueries/data/paymentMethodsQueries')
const ordersNinoxQueries = require('./dbQueries/sales/ordersNinoxQueries')
const ordersNinoxDetailsQueries = require('./dbQueries/sales/ordersNinoxDetailsQueries')
const paymentsNinoxQueries = require('./dbQueries/sales/paymentsNinoxQueries')
const data = require('./apisControllers/apisSalesData')

const cronController = {
    getNinoxData: async(req,res) => {
        try {

            // //get ninox sales from API
            // const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
            // url.searchParams.append('fecha', '01/06/2024')
            // url.searchParams.append('sucursalId', 1)
            // url.searchParams.append('incluirMediosPago', true)

            // const headers = {
            //     'Content-Type': 'application/json',
            //     'X-NX-TOKEN': 'bl9f6RQBLfq6JDDtFzWZFCtddlxxtIsR'
            // }

            // const response = await fetch(url, {
            //     method: 'GET',
            //     headers: headers
            // })

            // if (!response.ok) {
            //     throw new Error(`HTTP error! Status: ${response.status}`);
            // }

            // const data = await response.json()

            //get other data
            const customers = await customersQueries.customers()
            const paymentMethods = await paymentMethodsQueries.paymentMethods()

            //get invoices ids
            const idsInvoices = data.map(data => data.facturaId)
            const idsInvoicesUnique = [...new Set(idsInvoices)]
            const ordersData = []

            //complete data for sales_orders_ninox and sales_payments_ninox
            idsInvoicesUnique.forEach(id => {

                const allRows = data.filter(d => d.facturaId == id)
                const date = allRows[0].fechaText
                const customerName = allRows[0].cliente
                const idCustomers = customers.filter(c => c.customer_name == customerName)[0]
                const subtotal = allRows.reduce((sum, row) => sum + (row.precioVentaFinal * row.cantidad), 0)
                const orderNumber = parseInt(allRows[0].numeroFull.split("-")[1])
                const paymentMethod = allRows[0].formasPagoText
                const idPaymentsMethods = paymentMethods.filter(p => p.payment_method == paymentMethod)[0]
                
                ordersData.push({
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
                enabled:1,
                //orderDetails:allRows
                })        
            })

            //save data in orders_ninox
            await ordersNinoxQueries.saveOrders(ordersData)

            // //save payments in payments_ninox
            // for (let i = 0; i < ordersData.length; i++) {                
            //     //get order id
            //     const orderId = await ordersNinoxQueries.getOrder(ordersData[i].order_number)
            //     await paymentsNinoxQueries.registerOrderPayment(ordersData[i],orderId)
            // }

            // //save orders_ninox_details
            // const products = await productsQueries.products()
            // let orderDetails = []

            // for (let i = 0; i < ordersData.length; i++) {
                
            //     const orderId = await ordersNinoxQueries.getOrder(ordersData[i].order_number)

            //     for (let j = 0; j < ordersData[i].orderDetails.length; j++) {
            //         const findProduct = products.filter(p => p.description == ordersData[i].orderDetails[j].descripcion)[0]
            //         const productId = findProduct ? findProduct.id : null
            //         orderDetails.push({
            //             id_orders:orderId,
            //             description:ordersData[i].orderDetails[j].descripcion,
            //             id_products:productId,
            //             color:ordersData[i].orderDetails[j].color,
            //             size:ordersData[i].orderDetails[j].talle,
            //             unit_price:ordersData[i].orderDetails[j].precioVentaFinal,
            //             required_quantity:ordersData[i].orderDetails[j].cantidad,
            //             confirmed_quantity:ordersData[i].orderDetails[j].cantidad,
            //             extended_price:ordersData[i].orderDetails[j].cantidad * ordersData[i].orderDetails[j].precioVentaFinal
            //         })                    
            //     }

            //     await ordersNinoxDetailsQueries.saveOrderDetails(orderDetails)
                
            // }
            

            //res.status(200).json(data)

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

