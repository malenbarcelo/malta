
import og from "./globals.js"
import { clearInputs } from "../../generalFunctions.js"
import { printCustomerOrder } from "./printTables.js"

//CUSTOMER BALANCE POPUP (CBPP)
function cbppEventListeners() {

    cbppOrder.addEventListener("change", async() => {

        if (cbppOrder.value == '') {
            clearInputs([cbppSubtotal, cbppDiscount, cbppTotal, cbppPaid, cbppBalance])
        }else{
            const orderData = og.customerOrders.filter(o => o.id == cbppOrder.value)[0]
            cbppSubtotal.value = og.formatter.format(parseFloat(orderData.subtotal,2))
            cbppDiscount.value = parseFloat(orderData.discount,2) * 100
            cbppTotal.value = og.formatter.format(parseFloat(orderData.total,2))
            cbppPaid.value = og.formatter.format(parseFloat(orderData.amountPaid,2))
            cbppBalance.value = og.formatter.format(parseFloat(orderData.balance,2))

            if (orderData.id_orders_status == 1) {
                cbppOrderStatus.style.display = 'block'
            }else{
                cbppOrderStatus.style.display = 'none'
            }

            printCustomerOrder(orderData.orders_orders_details)
        }
    })

    

}

export {cbppEventListeners}