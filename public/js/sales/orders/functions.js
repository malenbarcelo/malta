import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { printOrders } from "./printOrders.js"

async function getData() {

    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.products = await (await fetch(dominio + 'apis/data/products')).json()
    og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
    og.ordersFiltered = og.orders
    og.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    og.customersSummary = await (await fetch(dominio + 'apis/sales/customers/customers-summary')).json()
    og.season = await (await fetch(dominio + 'apis/main/current-season')).json()

    applyFilters()
    printOrders()
}

function applyFilters() {

    og.ordersFiltered = og.orders

    //show canceled
    og.ordersFiltered = showCanceled.checked ? og.ordersFiltered : og.ordersFiltered.filter(o => o.enabled != 0)

    //customer
    let idCustomer = filterCustomer.value == '' ? '' : og.customers.filter(c => c.customer_name == filterCustomer.value)
    idCustomer = idCustomer.length == 0 ? 0 : idCustomer[0].id
    og.ordersFiltered = filterCustomer.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_customers == idCustomer)

    //order
    og.ordersFiltered = filterOrder.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.order_number == filterOrder.value)

    //order_manager
    og.ordersFiltered = filterOrderManager.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_managers == filterOrderManager.value)

    //order_status
    og.ordersFiltered = filterOrderStatus.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_status == filterOrderStatus.value)

    //order_status
    og.ordersFiltered = filterPaymentStatus.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_payments_status == filterPaymentStatus.value)

    //sales channels
    if (og.channelsChecked.length == 0) {
        og.ordersFiltered = og.ordersFiltered
    }else{
        const selectedChannels = og.channelsChecked.map(input => input.id)
        const channels = []
        
        selectedChannels.forEach(channel => {
            const channelId = parseInt(channel.split('_')[1])
            channels.push(channelId)
        })

        og.ordersFiltered  = og.ordersFiltered.filter(o => channels.includes(o.id_sales_channels))
    }

}

function updateOrdersData() {
    const total = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.total,2), 0)
    const amountPaid = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.amountPaid,2), 0)
    const balance = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.balance,2), 0)
    orderTotal.innerHTML = '<div><b>TOTAL:</b> $ ' + og.formatter.format(total) + '</div>'
    ordersAmountPaid.innerHTML = '<div><b>PAGADO:</b> $ ' + og.formatter.format(amountPaid) + '</div>'
    ordersBalance.innerHTML = '<div><b>SALDO:</b> $ ' + og.formatter.format(balance) + '</div>'
}

async function updateCustomerData() {

    og.customersSummary = await (await fetch(dominio + 'apis/sales/customers/customers-summary')).json()

    if (filterCustomer.value != '') {
        og.customerData = og.customersSummary.filter(c => c.customer_name == filterCustomer.value)
        const customerPositiveBalance = og.customerData.length > 0 ? og.customerData[0].positiveBalance : 0
        const customerNotes = og.customerData.length > 0 ? og.customerData[0].notes : null
    
        //balance
        if (customerPositiveBalance > 0) {
            positiveBalance.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><b>SALDO A FAVOR: </b>$' + og.formatter.format(customerPositiveBalance)
            positiveBalance.style.display = 'block'
        }else{
            positiveBalance.style.display = 'none'
        }

        //comments
        if (customerNotes == null || customerNotes =='') {
            notes.innerHTML = '<i class="fa-regular fa-comment"></i>'
        }else{
            notes.innerHTML = '<i class="fa-regular fa-comment-dots"></i>'
        }
        
        if (og.customerData.length > 0) {
            notes.style.display = 'block'
        }else{
            notes.style.display = 'none'
        }        
    }else{
        positiveBalance.style.display = 'none'
        notes.style.display = 'none'
    }
    
}

function updateOrderData() {

    og.orderData.subtotal = 0

    og.orderDetails.forEach(element => {
        og.orderData.subtotal += element.enabled == 0 ? 0 : parseFloat(element.extended_price,2)
    })

    og.orderData.total = og.orderData.subtotal * (1-og.orderData.discount)

    orderInfo.innerHTML = ''
    orderInfo.innerHTML += '<div class="orderInfoElement"><b>Subtotal:</b> $' + og.formatter.format(og.orderData.subtotal) +'</div>'
    orderInfo.innerHTML += '<div class="orderInfoElement orderInfoWithIcon"><b>Descuento:</b> ' + og.formatter.format(og.orderData.discount * 100) + '%<div><i class="fa-solid fa-pencil pointer" id="cdppDiscount"></i></idv></div>'
    orderInfo.innerHTML += '<div class="orderInfoElement"><b>Total:</b> $' +og.formatter.format( og.orderData.total) + '</div>'

    //createEdit order - change discount
    cdppDiscount.addEventListener("click", async() => {
        cdppNewDiscount.value = og.discount * 100
        cdpp.style.display = 'block'
    })

}

export {getData, updateOrdersData,updateOrderData, updateCustomerData,applyFilters}