import { salesChannels } from "../../../../src/dbQueries/data/salesChannelsQueries.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
// import { printOrders } from "./printOrders.js"
// import { dateToString,isValid,isInvalid } from "../../generalFunctions.js"


async function getData() {
    g.season = await (await fetch(dominio + 'apis/main/current-season')).json()
    g.orders = await (await fetch(dominio + 'apis/sales/web-orders/in-progress-orders/show-canceled')).json()
    g.ordersFiltered = g.orders
}

function updateTableData() {
    const total = g.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.total,2), 0)
    const amountPaid = g.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.amountPaid,2), 0)
    const balance = g.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.balance,2), 0)
    summaryTotal.innerHTML = '<div><b>TOTAL:</b> $ ' + g.formatter.format(total) + '</div>'
    summaryAmountPaid.innerHTML = '<div><b>PAGADO:</b> $ ' + g.formatter.format(amountPaid) + '</div>'
    summaryBalance.innerHTML = '<div><b>SALDO:</b> $ ' + g.formatter.format(balance) + '</div>'
}

function applyFilters() {

    loader.style.display = 'block'

    g.ordersFiltered = g.orders

    //customer
    g.ordersFiltered = customer.value == '' 
        ? g.ordersFiltered 
        : g.ordersFiltered.filter(o => o.customer.toLowerCase().includes(customer.value.toLowerCase()))

    //order number
    g.ordersFiltered = orderNumber.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.order_number == orderNumber.value)

    //order status
    g.ordersFiltered = orderStatus.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.id_orders_status == orderStatus.value)

    //payment status
    g.ordersFiltered = paymentStatus.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.id_payments_status == paymentStatus.value)

    //payment status
    g.ordersFiltered = salesChannel.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.id_payments_status == paymentStatus.value)

    loader.style.display = 'none'

}

export { getData, updateTableData, applyFilters }