import og from "./ordersGlobals.js"
import { clearInputs, dateToString } from "../../generalFunctions.js"

async function printTableOrders(dataToPrint) {

    ordersLoader.style.display = 'block'

    bodyOrders.innerHTML = ''

    let counter = 0

    //printTable
    dataToPrint.forEach(element => {

        const date = dateToString(element.date)
        const findOrderAmountPaid = og.ordersPayments.filter(o => o.id_orders == element.id)
        const amountPaid = findOrderAmountPaid.length == 0 ? 0 : findOrderAmountPaid[0].total_amount
        const balance = element.total - amountPaid
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const paymentClass = element.id_orders_status == 2 ? 'allowedIcon' : 'notAllowedIcon'
        const deliverClass = element.id_orders_status == 2 ? 'allowedIcon' : 'notAllowedIcon'
        const cancelClass = (element.id_orders_status == 1 || element.id_orders_status == 2) && (element.id_payments_status == 1 || element.id_payments_status == 2 || element.id_payments_status == 3) ? 'allowedIcon' : 'notAllowedIcon'
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + element.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.sales_channel + '</th>'        
        const line4 = '<th class="' + rowClass + '">' + element.orders_customers.customer_name + '</th>'
        const line5 = '<th class="' + rowClass + '">' + og.formatter.format(element.subtotal) + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.discount * 100 + '%' + '</th>'
        const line7 = '<th class="' + rowClass + '">' + og.formatter.format(element.total) + '</th>'
        const line8 = '<th class="' + rowClass + '">' + og.formatter.format(amountPaid) + '</th>'
        const line9 = '<th class="' + rowClass + '">' + og.formatter.format(balance) + '</th>'
        const line10 = '<th class="' + rowClass + '">' + element.orders_orders_status.order_status + '</th>'
        const line11 = '<th class="' + rowClass + '">' + element.orders_payments_status.payment_status + '</th>'
        const line12 = '<th class="' + rowClass + '">' + element.orders_orders_managers.order_manager_name + '</th>'
        const line13 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line14 = '<th class="' + rowClass + '"><i class="fa-regular fa-credit-card ' + paymentClass + '" id="' + (paymentClass == 'allowedIcon' ? ('payment_' + element.id) : null) +'"></i></th>'
        const line15 = '<th class="' + rowClass + '"><i class="fa-solid fa-truck-ramp-box ' + deliverClass + '" id="' + (deliverClass == 'allowedIcon' ? ('deliver_' + element.id) : null) +'"></i></th>'
        const line16 = '<th class="' + rowClass + '"><i class="fa-solid fa-user-pen allowedIcon" id="assign_' + element.id + '"></i></th>'        
        const line17 = '<th class="' + rowClass + '"><i class="fa-solid fa-ban ' + cancelClass + '" id="' + (cancelClass == 'allowedIcon' ? ('cancel_' + element.id) : null) +'"></i></th>'
        
        bodyOrders.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + line15 + line16 + line17 + '</tr>'

        counter += 1

    })

    addOrdersEventListeners(dataToPrint)
    
    ordersLoader.style.display = 'none'
}

function addOrdersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const payment = document.getElementById('payment_' + element.id)
        const deliverOrder = document.getElementById('deliver_' + element.id)
        const assignOrder = document.getElementById('assign_' + element.id)
        const cancelOrder = document.getElementById('cancel_' + element.id)
        
        const customer = og.customers.filter(c => c.id == element.id_customers)[0].customer_name

        //payment
        if (payment) {
            payment.addEventListener('click',async()=>{

                const findOrderAmountPaid = og.ordersPayments.filter(o => o.id_orders == element.id)
                const amountPaid = findOrderAmountPaid.length == 0 ? 0 : findOrderAmountPaid[0].total_amount
                const balance = element.total - amountPaid

                og.orderToPayPayments = {
                    amountPaid:parseFloat(amountPaid,2),
                    balance:balance
                }

                og.orderToPay = element
                rpppSubtotal.value = og.formatter.format(element.subtotal)
                rpppDiscount.value = og.formatter.format(element.discount * 100) + '%'
                rpppTotal.value = og.formatter.format(element.total)
                rpppPaid.value = og.formatter.format(amountPaid)
                rpppBalance.value = og.formatter.format(balance)
                rpppCustomerAccount.value = og.formatter.format(0)
                rpppNewBalance.value = og.formatter.format(balance)
                rpppBalanceAlert.innerHTML = ''
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


export {printTableOrders,filterOrders}