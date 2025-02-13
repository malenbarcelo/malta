import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData, completeELCPPcolors, completeELSPPsizes,applyFilters } from "./functions.js"
import { printOrdersDetails } from "./printOrdersDetails.js"
import { showOkPopup, inputsValidation,acceptWithEnterInput } from "../../generalFunctions.js"

//EDIT LINE POPUP (ELPP)
function elppEventListeners() {

    //change colors
    elppColorsIcon.addEventListener("click", async() => {
        completeELCPPcolors()
        elcppError.style.display = 'none'
        elcpp.style.display = 'block'
    })

    //change sizes
    elppSizesIcon.addEventListener("click", async() => {
        completeELSPPsizes()
        elsppError.style.display = 'none'
        elspp.style.display = 'block'
    })

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
            
            const data = {
                lineToEdit:odg.lineToEdit,
                unit_price:elppPrice.value,
                required_quantity:elppQtyR.value,
                confirmed_quantity:elppQtyC.value,
                colors:odg.selectedColors,
                sizes:odg.selectedSizes
            }
            
            const response = await fetch(dominio + 'apis/sales/edit-order-detail',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus1 = await response.json()

            if (responseStatus1.message == 'ok') {

                const orderId = odg.lineToEdit.orders_details_orders.id
                const customerId = odg.lineToEdit.orders_details_orders.id_customers
                const discount = parseFloat(odg.lineToEdit.orders_details_orders.discount)

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

    //elpp accept with enter
    acceptWithEnterInput(elppPrice,elppAccept)
    acceptWithEnterInput(elppQtyR,elppAccept)
    acceptWithEnterInput(elppQtyC,elppAccept)
}

export {elppEventListeners}