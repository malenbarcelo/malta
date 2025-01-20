
import og from "./globals.js"
import { dominio } from "../../dominio.js"
import { clearInputs, dateToString } from "../../generalFunctions.js"
import { printCustomerOrder } from "./printTables.js"

//CUSTOMER BALANCE POPUP (CBPP)
function cbppEventListeners() {

    cbppOrder.addEventListener("change", async() => {
        
        if (cbppOrder.value == '') {
            clearInputs([cbppSubtotal, cbppDiscount, cbppTotal, cbppPaid, cbppBalance])
            printCustomerOrder([])
            cbppPrintPdf.style.display = 'none'
            cbppIncompleteOrder.style.display = 'none'
            cbppDeliveredOrder.style.display = 'none'

        }else{
            const orderData = og.customerOrders.filter(o => o.id == cbppOrder.value)[0]
            cbppSubtotal.value = og.formatter.format(parseFloat(orderData.subtotal,2))
            cbppDiscount.value = (parseFloat(orderData.discount,2) * 100).toFixed(2)
            cbppTotal.value = og.formatter.format(parseFloat(orderData.total,2))
            cbppPaid.value = og.formatter.format(parseFloat(orderData.amountPaid,2))
            cbppBalance.value = og.formatter.format(parseFloat(orderData.balance,2))

            if (orderData.id_orders_status == 1) {
                cbppIncompleteOrder.style.display = 'block'
                cbppPrintPdf.style.display = 'none'
            }else{
                cbppIncompleteOrder.style.display = 'none'
                cbppPrintPdf.style.display = 'flex'
            }

            if (orderData.id_orders_status == 3) {
                cbppDeliveredOrder.style.display = 'block'
            }else{
                cbppDeliveredOrder.style.display = 'none'
            }

            printCustomerOrder(orderData.orders_orders_details)
        }
    })

    cbppChangeDiscount.addEventListener("click", async() => {
        if (cbppOrder.value != '') {
            chdppNewDiscount.value = cbppDiscount.value
            og.changeDiscountFrom = 'cbpp'
            chdppContent.style.left = 'calc(50vw - 160px)'
            chdpp.classList.add('popup2')
        chdpp.classList.remove('popup')
            chdpp.style.display = 'block'
        }
        
    })

    cbppPrintPdf.addEventListener("click", async() => {

        og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
        og.customerOrders = og.orders.filter(o => o.orders_customers.customer_name == filterCustomer.value)
        const orderData = og.customerOrders.filter(o => o.id == cbppOrder.value)[0]

        const data = {
            customerData:og.customerData[0],
            orderData: orderData
        }

        try {
            const response = await fetch(dominio + 'apis/composed/print-customer-balance', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
        
            if (!response.ok) {
                throw new Error('Error al generar el PDF')
            }
        
            // Convert answer to Blob
            const blob = await response.blob()
        
            // Create url
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = data.customerData.customer_name + ' - ' + '#' + String(data.orderData.order_number).padStart(5,'0') + ' (' + dateToString(data.orderData.date) + ').pdf' // Nombre del archivo
            document.body.appendChild(a)
            a.click() //Simulate click
            a.remove() //Remove url from DOM
        
            //Release the temporary URL
            window.URL.revokeObjectURL(url)
        
            console.log('PDF descargado con éxito')
        } catch (error) {
            console.error('Error al descargar el PDF:', error)
        }
    })

    

}

export {cbppEventListeners}