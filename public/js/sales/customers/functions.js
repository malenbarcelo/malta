import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { printCustomers } from "./printCustomers.js"

async function getData() {

    //get data and complete globals
    cg.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    cg.customersFiltered = cg.customers

    applyFilters()
    printCustomers()
}

function applyFilters() {

    cg.customersFiltered = cg.customers

    //customer
    cg.customersFiltered = filterCustomer.value == '' ? cg.customersFiltered : cg.customersFiltered.filter(c => c.customer_name == filterCustomer.value)

}



export {getData, applyFilters}