import { dominio } from "../../dominio.js"
import pmg from "./globals.js"
import { printPaymentMethods } from "./printPaymentMethods.js"

async function getData() {

    //get data and complete globals
    pmg.paymentMethods = await (await fetch(dominio + 'apis/data/payment-methods')).json()
    pmg.paymentMethodsFiltered = pmg.paymentMethods

    applyFilters()
    printPaymentMethods()
}

function applyFilters() {
    pmg.paymentMethodsFiltered = pmg.paymentMethods

    //payment method
    pmg.paymentMethodsFiltered = filterMethod.value == '' ? pmg.paymentMethodsFiltered : pmg.paymentMethodsFiltered.filter(pm => (pm.payment_method).toLowerCase() == (filterMethod.value).toLowerCase())

}

export {getData, applyFilters}