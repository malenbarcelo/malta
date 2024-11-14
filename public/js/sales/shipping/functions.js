import { dominio } from "../../dominio.js"
import g from "./globals.js"

async function getData() {

    g.orders = await (await fetch(dominio + 'apis/sales/not-shipped-orders')).json()
    g.ordersFiltered = g.orders
    console.log(g.orders)
}

function applyFilters() {

    cg.customersFiltered = cg.customers

    //customer
    cg.customersFiltered = filterCustomer.value == '' ? cg.customersFiltered : cg.customersFiltered.filter(c => c.customer_name == filterCustomer.value)

}



export {getData, applyFilters}