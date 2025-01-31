import { dominio } from "../../dominio.js"
import g from "./globals.js"

async function getData() {

    g.orders = await (await fetch(dominio + 'apis/sales/not-shipped-orders')).json()
    g.ordersFiltered = g.orders
    g.shippingMethods = await (await fetch(dominio + 'apis/data/shipping-methods')).json()
}

function applyFilters() {

    g.ordersFiltered = g.orders

    //order number
    g.ordersFiltered = orderNumber.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.order_number == orderNumber.value)

    //customer
    g.ordersFiltered = customer.value == '' ? g.ordersFiltered : g.ordersFiltered.filter(o => o.orders_customers.customer_name.toLowerCase().includes(customer.value.toLowerCase()))

}

export {getData, applyFilters}