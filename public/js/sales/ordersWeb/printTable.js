
import g from "./globals.js"
import { dateToString,clearInputs } from "../../generalFunctions.js"
import { updateTableData } from "./functions.js"

function printTable() {

    loader.style.display = 'block'        
    body.innerHTML = ''
    const dataToPrint = g.ordersFiltered

    let counter = 0
    const fragment = document.createDocumentFragment()

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'        
        const row = document.createElement('tr')

        row.innerHTML = `
            <th class="${rowClass}">${element.order_number}</th>
            <th class="${rowClass}">${g.season.season}</th>            
            <th class="${rowClass}">${dateToString(element.date)}</th>
            <th class="${rowClass}">${element.customer}</th>
            <th class="${rowClass}">${element.payment_method == 'EFECTIVO EN EL LOCAL' ? 'Abona y retira' : 'Transferencia'}</th>
            <th class="${rowClass}">${g.formatter.format(parseFloat(element.subtotal,2).toFixed(2))}</th>
            <th class="${rowClass}">${g.formatter.format(parseFloat(element.fee,2).toFixed(2))}</th>
            <th class="${rowClass}">${g.formatter.format(parseFloat(element.shipping,2).toFixed(2))}</th>
            <th class="${rowClass}">${g.formatter.format(parseFloat(element.total,2).toFixed(2))}</th>
            <th class="${rowClass}">${0}</th>
            <th class="${rowClass}">${g.formatter.format(parseFloat(element.total,2).toFixed(2))}</th>
            <th class="${rowClass}">${element.order_status_data.order_status}</th>
            <th class="${rowClass}">${element.payment_status_data.payment_status}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-credit-card allowedIcon" id="payment_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-comment-dots allowedIcon" id="obs_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-circle-xmark allowedIcon" id="cancel_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    body.appendChild(fragment)

    //Add event listeners
    //shippingEventListeners(dataToPrint)

    //update table data
    updateTableData()

    loader.style.display = 'none'   
}

function shippingEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const deliver = document.getElementById('deliver_' + element.id)

        deliver.addEventListener('click',async()=>{
            g.idOrderToDeliver = element.id
            coppQuestion.innerHTML = '¿Confirma que desea entregar el pedido #<b>' + element.order_number + '</b> del cliente <b>' + element.orders_customers.customer_name + '</b>?'
            copp.style.display = 'block'
        })

        edit.addEventListener('click',async()=>{

            clearInputs([eshppMobile, eshppMethod, eshppNumber, eshppCompany, eshppObservations])
            eshppCustomer.innerText = element.orders_customers.customer_name
            eshppOrderNumber.innerText = '#' + String(element.order_number).padStart(5,'0')
            g.idOrderToEdit = element.id
            g.idCustomerToEdit = element.id_customers
            g.initialMobile = element.orders_customers.mobile

            //complete data
            eshppMobile.value = element.orders_customers.mobile == 0 || element.orders_customers.mobile == null ? '' : element.orders_customers.mobile
            const selectedOption = (element.id_shipping_methods == null || element.id_shipping_methods == 'default') ? document.getElementById('0') : document.getElementById('method_' + element.id_shipping_methods)
            selectedOption.selected = true
            eshppNumber.value = element.shipping_number
            eshppCompany.value = element.shipping_company
            eshppObservations.value = element.shipping_observations
            
            eshpp.style.display = 'block'
        })
        
    })
    
}

export {printTable}