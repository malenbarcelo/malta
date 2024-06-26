import { dominio } from "../../dominio.js"
import sg from "../sales/salesGlobals.js"
import { dateToString } from "../../generalFunctions.js"

async function printTableSales(dataToPrint) {

    salesLoader.style.display = 'block'
    bodySales.innerHTML = ''
    let counter = 0
    let amount = 0

    //printTable
    dataToPrint.forEach(element => {

        const date = dateToString(element.date)
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const customer = element.orders_customers == null ? '' : element.orders_customers.customer_name
        amount += parseFloat(element.total,2)
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + element.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.sales_channel + '</th>'
        const line4 = '<th class="' + rowClass + '">' + customer + '</th>'
        const line5 = '<th class="' + rowClass + '">' + sg.formatter.format(element.subtotal) + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.discount * 100 + '%' + '</th>'
        const line7 = '<th class="' + rowClass + '">' + sg.formatter.format(element.total) + '</th>'
        const line8 = '<th class="' + rowClass + '"><i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="edit_' + element.id + '"></i></th>'
        

        bodySales.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + '</tr>'

        counter += 1

    })

    //get main data

    salesAmount.innerHTML = '<b>Total (ARS):</b> $' + sg.formatter.format(amount)
    salesQty.innerHTML = '<b>Cantidad:</b> ' + dataToPrint.length

    //addOrdersEventListeners(dataToPrint)

    salesLoader.style.display = 'none'
}

function addOrdersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const payment = document.getElementById('payment_' + element.id)
        const deliverOrder = document.getElementById('deliver_' + element.id)
        const assignOrder = document.getElementById('assign_' + element.id)
        const cancelOrder = document.getElementById('cancel_' + element.id)
        const customer = element.orders_customers.customer_name

        //payment
        if (payment) {
            payment.addEventListener('click',async()=>{

                //find customer positive balance and show checkbox if applies
                let positiveBalance = await (await fetch(dominio + 'apis/sales/customer-positive-balance/' + element.id_customers)).json()

                if (positiveBalance > 0) {
                    og.orderToPayCustomerBalance = positiveBalance
                    rpppUseBalanceLabel.innerText = 'Usar saldo a favor (ARS ' + og.formatter.format(positiveBalance) + ')'
                    rpppUseBalance.classList.remove('notVisible')
                }else{
                    rpppUseBalance.classList.add('notVisible')
                    og.orderToPayCustomerBalance = 0
                }

                //complete elements and globals data
                og.orderToPay = element
                rpppSubtotal.value = og.formatter.format(element.subtotal)
                rpppDiscount.value = og.formatter.format(element.discount * 100) + '%'
                rpppTotal.value = og.formatter.format(element.total)
                rpppPaid.value = og.formatter.format(element.amountPaid)
                rpppBalance.value = og.formatter.format(element.balance)
                rpppBalanceUsed.value = og.formatter.format(0)
                rpppNewBalance.value = og.formatter.format(element.balance)
                rpppBalanceAlert.innerHTML = ''
                rpppUseBalanceCheck.checked = false
                clearInputs(og.rpppValidate)
                rppp.style.display = 'block'
            })
        }

        //deliver order
        if (deliverOrder) {
            deliverOrder.addEventListener('click',async()=>{
                og.idOrderToDeliver = element.id
                doppQuestion.innerHTML = '¿Confirma que desea entregar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                dopp.style.display = 'block'
            })
        }

        //assign manager
        if (assignOrder) {
            assignOrder.addEventListener('click',async()=>{
                amppSelectOM.value = element.id_orders_managers
                og.idOrderToAssign = element.id
                ampp.style.display = 'block'
            })
        }

        //cancel order
        if (cancelOrder) {
            cancelOrder.addEventListener('click',async()=>{
                og.idOrderToCancel = element.id
                coppQuestion.innerHTML = '¿Confirma que desea cancelar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                copp.style.display = 'block'
            })
        }

    })

}

function filterOrders() {

    og.ordersFiltered = og.orders

    //customer
    const idCustomer = filterCustomer.value == 'default' ? '' :og.customers.filter(c => c.customer_name == filterCustomer.value)[0].id
    og.ordersFiltered = filterCustomer.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_customers == idCustomer)

    //order
    og.ordersFiltered = filterOrder.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.order_number == filterOrder.value)

    //order_manager
    og.ordersFiltered = filterOrderManager.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_managers == filterOrderManager.value)

    //order_status
    og.ordersFiltered = filterOrderStatus.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_status == filterOrderStatus.value)

    //order_status
    og.ordersFiltered = filterPaymentStatus.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_payments_status == filterPaymentStatus.value)

    //sales channels
    if (og.checkedElements.length == 0) {
        og.ordersFiltered = []
    }else{
        const channels = og.checkedElements.map(input => input.id)
        og.ordersFiltered = og.ordersFiltered.filter(o => channels.some(channel => o.sales_channel.includes(channel)))
    }


}


export {printTableSales}