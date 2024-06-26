const customersQueries = require('./dbQueries/data/customersQueries')
const paymentMethodsQueries = require('./dbQueries/data/paymentMethodsQueries')

const cronController = {
    getNinoxData: async(req,res) => {
        try {

            //get ninox sales from API
            const url = new URL('https://sync.ninox.com.ar/api/Terceros/exportar/ventaitems')
            url.searchParams.append('fecha', '25/06/2024')
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

            //get other data
            const customers = await customersQueries.customers()
            const paymentMethods = await paymentMethodsQueries.paymentMethods()

            //get invoices ids
            const idsInvoices = data.map(data => data.facturaId)
            const idsInvoicesUnique = [...new Set(idsInvoices)]
            const ordersData = []

            console.log(idsInvoicesUnique.length)

        }catch (error) {
             console.log(error)
        }
    }
}

module.exports = cronController

