import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { applyFilters, updateOrderData} from "./functions.js"
import { printOrders } from "./printOrders.js"

//CHANGE DISCOUNT POPUP (CHDPP)
function chdppEventListeners() {

    chdppAccept.addEventListener("click", async() => {
        if (og.changeDiscountFrom == 'ceopp') {
            og.orderData.discount = chdppNewDiscount.value == '' ? 0 : chdppNewDiscount.value / 100
            updateOrderData()
            chdpp.style.display = 'none'
        }else{

            const orderData = og.orders.filter( o => o.id == cbppOrder.value)[0]
            const newDiscount = parseFloat(chdppNewDiscount.value,2) / 100
            const newTotal = parseFloat(orderData.subtotal,2) * (1 - newDiscount)
            
            const data = [{
                id:parseInt(cbppOrder.value),
                discount:newDiscount,
                total:newTotal               
            }]

            //update table
            await fetch(dominio + 'apis/update/sales-orders',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //update inputs
            cbppDiscount.value = chdppNewDiscount.value
            cbppTotal.value = og.formatter.format(parseFloat(newTotal,2))
            cbppBalance.value = og.formatter.format(parseFloat(newTotal,2) - parseFloat(orderData.amountPaid,2))

            //update orders
            og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
            applyFilters()
            printOrders()

            //close popup
            chdpp.style.display = 'none'

        }
    })

}

export {chdppEventListeners}