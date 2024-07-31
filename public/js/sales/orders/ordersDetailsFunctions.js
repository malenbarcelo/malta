import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { dateToString } from "../../generalFunctions.js"

async function printTableOrdersDetails(dataToPrint) {

    ordersDetailsLoader.style.display = 'block'
    bodyOrdersDetails.innerHTML = ''
    let counter = 0

    //printTable
    dataToPrint.forEach(element => {
        
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const orderData = element.orders_details_orders
        const date = dateToString(orderData.date)
        
        const requiredQuantity = element.required_quantity == null ? '' : element.required_quantity
        const confirmedQuantity = element.confirmed_quantity == null ? '' : element.confirmed_quantity

        //print table
        const line1 = '<th class="' + rowClass + '">' + orderData.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + orderData.orders_sales_channels.sales_channel + '</th>'
        const line4 = '<th class="' + rowClass + '">' + orderData.orders_customers.customer_name + '</th>'
        const line5 = '<th class="' + rowClass + '">' + element.description + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.size + '</th>'
        const line7 = '<th class="' + rowClass + '">' + element.color + '</th>'
        const line8 = '<th class="' + rowClass + '">' + element.unit_price + '</th>'
        const line9 = '<th class="' + rowClass + '">' + requiredQuantity + '</th>'
        const line10 = '<th class="' + rowClass + '">' + confirmedQuantity + '</th>'
        const line11 = '<th class="' + rowClass + '">' + orderData.orders_orders_status.order_status + '</th>'
        const line12 = '<th class="' + rowClass + '">' + orderData.orders_orders_managers.order_manager_name + '</th>'
        const line13 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line14 = '<th class="' + rowClass + '"><i class="fa-regular fa-comment allowedIcon" id="obs_' + element.id + '"></i></th>'
        const line15 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></i></th>'
        

        bodyOrdersDetails.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + line15 + '</tr>'

        counter += 1

    })

    addOrdersDetailsEventListeners(dataToPrint)

    ordersDetailsLoader.style.display = 'none'
}

function addOrdersDetailsEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const deleteLine = document.getElementById('delete_' + element.id)
        const obs = document.getElementById('obs_' + element.id)

        //edit line
        edit.addEventListener('click',async()=>{

            odg.lineToEdit = element
            elppPrice.value = element.unit_price
            elppQtyR.value = element.required_quantity
            elppQtyC.value = element.confirmed_quantity
            elpp.style.display = 'block'
            
        })

        //delete line        
        deleteLine.addEventListener('click',async()=>{

            odg.orderToEditLines = odg.ordersDetails.filter(o => o.id_orders == element.id_orders)
            odg.lineToDelete = element
            dlppQuestion.innerHTML = '¿Confirma que desea eliminar el item <b>' + element.description + '</b> de la orden <b>' + element.orders_details_orders.order_number + '</b> del cliente <b>' + element.orders_details_orders.orders_customers.customer_name + '</b>'            
            dlpp.style.display = 'block'
        })

        //line observations
        obs.addEventListener('click',async()=>{
            odg.lineToEdit = element
            loppObs.value = element.observations2
            lopp.style.display = 'block'         
        })

    })
}

function filterOrdersDetails() {

    odg.ordersDetailsFiltered = odg.ordersDetails

    //order
    odg.ordersDetailsFiltered = filterOrder.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.order_number == filterOrder.value)

    //product
    odg.ordersDetailsFiltered = filterProduct.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.description == filterProduct.value)

    //customer
    let idCustomer = filterCustomer.value == '' ? '' : odg.customers.filter(c => c.customer_name == filterCustomer.value)
    idCustomer = idCustomer.length == 0 ? 0 : idCustomer[0].id
    odg.ordersDetailsFiltered = idCustomer == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_customers == idCustomer)

    //order_status
    if (filterOrderStatus.value == 'default') {
        odg.ordersDetailsFiltered = odg.ordersDetailsFiltered
    }else{
        if (filterOrderStatus.value == 'complete') {
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity != null)
        }else{
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity == null)
        }
    }

    //order_manager
    odg.ordersDetailsFiltered = filterOrderManager.value == 'default' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_orders_managers == filterOrderManager.value)
}





export {printTableOrdersDetails,filterOrdersDetails}