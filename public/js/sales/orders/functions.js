import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import {filterOrders,printTableOrders} from "./ordersFunctions.js"

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

async function updateData() {

    updateCustomerData()
    og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    filterOrders()
    printTableOrders(og.ordersFiltered)
}

export {updateData,updateCustomerData}