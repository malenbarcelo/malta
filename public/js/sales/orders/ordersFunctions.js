import og from "./ordersGlobals.js"
import { isValid, isInvalid, clearData, dateToString } from "../../generalFunctions.js"

async function printTableOrders(dataToPrint) {

    ordersLoader.style.display = 'block'

    const formatter = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    })
    
    bodyOrders.innerHTML = ''

    let counter = 0

    //printTable
    dataToPrint.forEach(element => {

        const customer = og.customers.filter(c => c.id == element.id_customers)[0].customer_name
        const date = dateToString(element.date)
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const deliverClass = element.status == 'Completo' ? 'allowedIcon' : 'notAllowedIcon'
        const cancelClass = (element.balance != element.total || element.status == 'Cancelado') ? 'notAllowedIcon' : 'allowedIcon'
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + element.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.sales_channel + '</th>'        
        const line4 = '<th class="' + rowClass + '">' + customer + '</th>'
        const line5 = '<th class="' + rowClass + '">' + formatter.format(element.subtotal) + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.discount * 100 + '%' + '</th>'
        const line7 = '<th class="' + rowClass + '">' + formatter.format(element.total) + '</th>'
        const line8 = '<th class="' + rowClass + '">' + formatter.format(element.balance) + '</th>'
        const line9 = '<th class="' + rowClass + '">' + element.status + '</th>'
        const line10 = '<th class="' + rowClass + '">' + element.order_manager + '</th>'
        const line11 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line12 = '<th class="' + rowClass + '"><i class="fa-regular fa-credit-card allowedIcon" id="payment_' + element.id + '"></i></th>'        
        const line13 = '<th class="' + rowClass + '"><i class="fa-solid fa-truck-ramp-box ' + deliverClass + '" id="' + (deliverClass == 'allowedIcon' ? ('deliver_' + element.id) : null) +'"></i></th>'
        const line14 = '<th class="' + rowClass + '"><i class="fa-solid fa-user-plus allowedIcon" id="addManager_"' + element.id + '"></i></th>'        
        const line15 = '<th class="' + rowClass + '"><i class="fa-solid fa-ban ' + cancelClass + '" id="' + (cancelClass == 'allowedIcon' ? ('cancel_' + element.id) : null) +'"></i></th>'
        bodyOrders.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + line15 + '</tr>'

        counter += 1

    })

    addOrdersEventListeners(dataToPrint)
    
    ordersLoader.style.display = 'none'
}

function addOrdersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const cancelOrder = document.getElementById('cancel_' + element.id)
        const deliverOrder = document.getElementById('deliver_' + element.id)
        const customer = og.customers.filter(c => c.id == element.id_customers)[0].customer_name

        //deliver order
        if (deliverOrder) {
            deliverOrder.addEventListener('click',async()=>{
                og.idOrderToDeliver = element.id
                doppQuestion.innerHTML = '¿Confirma que desea entregar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                dopp.style.display = 'block'
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
    og.ordersFiltered = filterOrderManager.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.order_manager == filterOrderManager.value)
    
    //status
    og.ordersFiltered = filterOrderStatus.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.status == filterOrderStatus.value)
    
    //payment status
    if (filterPaymentStatus.value == 'paid') {
        og.ordersFiltered = og.ordersFiltered.filter(o => o.balance == 0)
    }else{
        if (filterPaymentStatus.value == 'unpaid') {
            og.ordersFiltered = og.ordersFiltered.filter(o => o.balance > 0)
        }
    }

    //sales channels
    if (og.checkedElements.length == 0) {
        og.ordersFiltered = []
    }else{
        const channels = og.checkedElements.map(input => input.id)
        og.ordersFiltered = og.ordersFiltered.filter(o => channels.some(channel => o.sales_channel.includes(channel)))
    }
    
    
}


export {printTableOrders,filterOrders}