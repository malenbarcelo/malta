
import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import {clearInputs,isValid} from "../../generalFunctions.js"

async function printCustomers() {

    customersLoader.style.display = 'block'
    
    const dataToPrint = cg.customersFiltered
        
    bodyCustomers.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        const row = document.createElement('tr')

        row.innerHTML = `
            <th class="${rowClass}">${element.customer_name}</th>
            <th class="${rowClass}">${element.email == null ? '' : element.email}</th>
            <th class="${rowClass}">${element.address == null ? '' : element.address}</th>
            <th class="${rowClass}">${element.mobile == null || element.mobile == 0 ? '' : element.mobile}</th>
            <th class="${rowClass}">${(parseFloat(element.discount,2)*100).toFixed(2) + '%'}</th>
            <th class="${rowClass}">${element.notes == null ? '' : element.notes}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="destroy_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    bodyCustomers.appendChild(fragment)

    // Add customersevent listeners
    customersEventListeners(dataToPrint)

    customersLoader.style.display = 'none'   
}

function customersEventListeners() {

    cg.customersFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const destroy = document.getElementById('destroy_' + element.id)

        destroy.addEventListener('click',async()=>{
            cg.idCustomer = element.id
            coppQuestion.innerHTML = '¿Confirma que desea dar de baja al clientes <b>' + element.customer_name + '</b>?'
            copp.style.display = 'block'
        })

        edit.addEventListener('click',async()=>{

            clearInputs(cg.ccppInputs)
            isValid(cg.ccppInputs)
            filterCustomer.value = ''
            ccppTitle.innerText = 'EDITAR CLIENTE'
            ccppCreate.style.display = 'none'
            ccppEdit.style.display = 'block'
            cg.customerToEdit = element.customer_name
            cg.idCustomer = element.id

            //complete data
            ccppCustomer.value = element.customer_name
            ccppEmail.value = element.email
            ccppAddress.value = element.address
            ccppCity.value = element.city
            ccppCountry.value = element.country
            ccppDiscount.value = element.discount
            ccppNotes.value = element.notes

            ccpp.style.display = 'block'
        })
        
    })
    
}

export {printCustomers}