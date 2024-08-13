import { dominio } from "../../dominio.js"
import cg from "./cGlobals.js"

async function printCustomersSummary(dataToPrint) {

    customersLoader.style.display = 'block'    
    bodyCustomers.innerHTML = ''
    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {
        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        
        const row = document.createElement('tr')
        row.innerHTML = `
            <th class="${rowClass}">${element.customer_name}</th>
            <th class="${rowClass}">${cg.formatter.format(element.ordersBalance)}</th>
            <th class="${rowClass}">${cg.formatter.format(element.positiveBalance)}</th>
            <th class="${rowClass}">${cg.formatter.format(element.positiveBalance - element.ordersBalance)}</th>            
            <th class="${rowClass}"><i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="edit_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    bodyCustomers.appendChild(fragment)

    // Añadir los event listeners a los elementos recién creados
    //addSalesEventListeners(dataToPrint);

    customersLoader.style.display = 'none'   
}

// function addSalesEventListeners() {

//     sg.sales.forEach(element => {

//         const deleteSale = document.getElementById('delete_' + element.id)
        
//         //delete sale
//         if (deleteSale) {
//             deleteSale.addEventListener('click',async()=>{
//                 sg.idSaleToDelete = element.id
//                 dsppQuestion.innerHTML = '¿Confirma que desea cancelar el pedido <b>N° ' + element.order_number + '</b> de Ninox </b>?'
//                 dspp.style.display = 'block'
//             })
//         }
//     })
    
// }


export {printCustomersSummary}