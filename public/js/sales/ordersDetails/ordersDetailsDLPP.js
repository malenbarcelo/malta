import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { applyFilters, getData } from "./functions.js"
import { showOkPopup } from "../../generalFunctions.js"
import { printOrdersDetails } from "./printOrdersDetails.js"

//DELETE LINE POPUP (DLPP)
function dlppEventListeners() {

    dlppAccept.addEventListener("click", async() => {

        ordersDetailsLoader.style.display = 'block'
        bodyOrdersDetails.innerHTML = ''
        dlpp.style.display = 'none'

        let responseStatus1
        let responseStatus2
        let responseStatus3
        
        const data = [{
            id:odg.lineToDelete.id,
            enabled:0
        }]
        
        const response = await fetch(dominio + 'apis/update/sales-orders-details',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        responseStatus1 = await response.json()

        if (responseStatus1.message == 'ok') {

            const orderId = odg.lineToDelete.orders_details_orders.id
            const customerId = odg.lineToDelete.orders_details_orders.id_customers
            const discount = parseFloat(odg.lineToDelete.orders_details_orders.discount)

            //get new order data
            const details = await (await fetch(`${dominio}apis/get/sales-orders-details?id_orders=${orderId}`)).json()

            // get new subtotal
            const subtotal = details.rows.reduce((sum, item) => sum + (parseFloat(item.extended_price) || 0), 0)
            const total = subtotal * (1 - discount)
            
            //get order status
            const idOrderStatus = details.rows.filter( d => d.confirmed_quantity == null || d.confirmed_quantity == '').length > 0 ? 1 : 2

            //get payment status
            const transactions = await (await fetch(`${dominio}apis/get/sales-transactions?id_orders=${orderId}`)).json()
            const amountPaid = transactions.rows.reduce((sum, t) => sum + parseFloat(t.amount), 0)
            const orderBalance = total - amountPaid
            const idPaymentsStatus = orderBalance == 0 ? 5 : ( orderBalance > 0 ? 4 : 3)

            const data = [{
                id:orderId,
                total:total,
                subtotal:subtotal,
                id_orders_status: idOrderStatus,
                id_payments_status: idPaymentsStatus
            }]

            //update order
            const response = await fetch(dominio + 'apis/update/sales-orders',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus2 = await response.json()

            // create not assigned payment if necessary
            console.log(orderBalance)
            if (responseStatus2.message == 'ok' && orderBalance < 0) {

                //get date
                let date = new Date()
                date = date.setHours(date.getHours() + 3)

                const data = [
                    {
                        date:date,
                        amount: -orderBalance,
                        type:'PAGO NO ASIGNADO',
                        id_customers:customerId
                    },
                    {
                        date:date,
                        amount: orderBalance,
                        type:'PAGO ASIGNADO',
                        id_customers:customerId,
                        id_orders:orderId   
                    },
                ]

                const response = await fetch(dominio + 'apis/create/sales-transactions',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                responseStatus3 = await response.json()

            }

            await getData()
            applyFilters()
            printOrdersDetails()

            if (responseStatus1.message == 'ok' && responseStatus2.message == 'ok' && (!responseStatus3 || (responseStatus3 && responseStatus3.message == 'ok'))) {
                okText.innerText = 'Línea eliminada con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al eliminar la línea'
                showOkPopup(errorPopup)
            }
            
            ordersDetailsLoader.style.display = 'none'
        }
    })
}

export {dlppEventListeners}