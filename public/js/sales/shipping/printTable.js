
import g from "./globals.js"

function printTable() {

    loader.style.display = 'block'        
    body.innerHTML = ''
    const dataToPrint = g.orders

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'        
        const row = document.createElement('tr')

        row.innerHTML = `
            <th class="${rowClass}">${element.date}</th>
            <th class="${rowClass}">${element.order_number}</th>
            <th class="${rowClass}">${element.orders_customers.customer_name}</th>
            <th class="${rowClass}">${element.orders_customers.customer_name}</th>
            
            <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="destroy_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    body.appendChild(fragment)

    // Add customersevent listeners
    //customersEventListeners(dataToPrint)

    loader.style.display = 'none'   
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

export {printTable}