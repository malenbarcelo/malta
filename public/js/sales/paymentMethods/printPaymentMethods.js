
import { dominio } from "../../dominio.js"
import pmg from "./globals.js"
import {clearInputs,isValid} from "../../generalFunctions.js"

async function printPaymentMethods() {

    paymentMethodsLoader.style.display = 'block'
    
    bodyPaymentMethods.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    pmg.paymentMethodsFiltered.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        const row = document.createElement('tr')

        row.innerHTML = `
            <th class="${rowClass}">${element.payment_method}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="destroy_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    bodyPaymentMethods.appendChild(fragment)

    // Add customersevent listeners
    paymentMethodsventListeners()

    paymentMethodsLoader.style.display = 'none'   
}

function paymentMethodsventListeners() {

    pmg.paymentMethodsFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const destroy = document.getElementById('destroy_' + element.id)

        destroy.addEventListener('click',async()=>{
            pmg.idPaymentMethod = element.id
            coppQuestion.innerHTML = '¿Confirma que desea dar de baja la forma de pago <b>' + element.payment_method + '</b>?'
            copp.style.display = 'block'
        })

        // edit.addEventListener('click',async()=>{

        //     clearInputs(cg.ccppInputs)
        //     isValid(cg.ccppInputs)
        //     filterCustomer.value = ''
        //     ccppTitle.innerText = 'EDITAR CLIENTE'
        //     ccppCreate.style.display = 'none'
        //     ccppEdit.style.display = 'block'
        //     cg.customerToEdit = element.customer_name
        //     cg.idCustomer = element.id

        //     //complete data
        //     ccppCustomer.value = element.customer_name
        //     ccppEmail.value = element.email
        //     ccppAddress.value = element.address
        //     ccppCity.value = element.city
        //     ccppCountry.value = element.country
        //     ccppDiscount.value = element.discount
        //     ccppNotes.value = element.notes

        //     ccpp.style.display = 'block'
        // })
        
    })
    
}

export {printPaymentMethods}