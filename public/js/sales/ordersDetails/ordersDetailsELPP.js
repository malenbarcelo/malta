import { dominio } from "../../dominio.js"
import g from "./globals2.js"
import { f } from "./functions2.js"
import { printDetails } from "./printDetails2.js"
import { completeELCPPcolors, completeELSPPsizes } from "./functions.js"
import { showOkPopup, inputsValidation } from "../../generalFunctions.js"

//EDIT LINE POPUP (ELPP)
function elppEventListeners() {

    // //change colors
    // elppColorsIcon.addEventListener("click", async() => {
    //     completeELCPPcolors()
    //     elcppError.style.display = 'none'
    //     elcpp.style.display = 'block'
    // })

    // //change sizes
    // elppSizesIcon.addEventListener("click", async() => {
    //     completeELSPPsizes()
    //     elsppError.style.display = 'none'
    //     elspp.style.display = 'block'
    // })

    //elpp accept    
    elppAccept.addEventListener("click", async() => {

        const errors = inputsValidation([elppPrice])

        if (errors == 0) {

            ordersDetailsLoader.style.display = 'block'
            bodyOrdersDetails.innerHTML = ''
            elpp.style.display = 'none'

            let responseStatus1
            let responseStatus2
            let responseStatus3
            
            const data = [{
                id:g.lineToEdit.id,
                unit_price: parseFloat(elppPrice.value),
                required_quantity: elppQtyR.value,
                confirmed_quantity: elppQtyC.value == '' ? null : parseInt(elppQtyC.value),
                extended_price: elppQtyC.value == '' ? 0 : parseFloat(elppPrice.value) * parseFloat(elppQtyC.value)
            }]
            
            // update orders_details
            const response = await fetch(dominio + 'apis/update/sales-orders-details',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus1 = await response.json()

            console.log(responseStatus1)

            if (responseStatus1.message == 'ok') {

                const orderId = g.lineToEdit.id_orders
                const customerId = g.lineToEdit.orders_details_orders.id_customers
                const discount = parseFloat(g.lineToEdit.orders_details_orders.discount)

                //get new order data
                const details = await (await fetch(`${dominio}apis/get/sales-orders-details?id_orders=${orderId}`)).json()

                // get new subtotal
                const subtotal = details.rows.reduce((sum, item) => sum + (parseFloat(item.extended_price) || 0), 0)
                const total = subtotal * (1 - discount)
                
                //get order status
                const idOrderStatus = details.rows.some(d => d.confirmed_quantity == null || d.confirmed_quantity === '') ? 1 : 2

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

                console.log(responseStatus2)

                // create not assigned payment if necessary
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

                    console.log(responseStatus3)

                }

                console.log(1)

                //update scroll data
                g.loadedPages = new Set()
                g.previousScrollTop = 0

                console.log(2)

                //get and print data
                console.log(3)
                g.details = await f.getDetails()
                console.log(4)
                printDetails()
                console.log(5)

                ordersDetailsTable.scrollTop = 0

                console.log(8)

                if (responseStatus1.message == 'ok' && responseStatus2.message == 'ok' && (!responseStatus3 || (responseStatus3 && responseStatus3.message == 'ok'))) {
                    okText.innerText = 'Línea editada con éxito'
                    showOkPopup(okPopup)
                }else{
                    errorText.innerText = 'Error al editar la línea'
                    showOkPopup(errorPopup)
                }

                ordersDetailsLoader.style.display = 'none'
            }
        }
    })

}

export {elppEventListeners}