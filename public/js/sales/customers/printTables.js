import { dominio } from "../../dominio.js"
import cg from "./globals.js"

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
            <th class="${rowClass}">${cg.formatter.format(element.netBalance)}</th>            
            <th class="${rowClass}"><i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="view_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    bodyCustomers.appendChild(fragment)

    //update balance
    updateBalance()

    // Add customersevent listeners
    customersEventListeners(dataToPrint)

    customersLoader.style.display = 'none'   
}

function customersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const view = document.getElementById('view_' + element.id)

        view.addEventListener('click',async()=>{

            console.log(element)

            csppCustomer.innerText = element.customer_name
            cg.idCustomer = element.id
            
            //show popup
            cspp.classList.add('slideIn')
        })
        
    })
    
}

function updateBalance() {

    const netBalance = cg.customersSummaryFiltered.reduce((acc, i) => acc + i.netBalance, 0)
    balance.innerHTML = '<b>SALDO NETO: </b>$ ' + cg.formatter.format(netBalance)
    
}


export {printCustomersSummary}