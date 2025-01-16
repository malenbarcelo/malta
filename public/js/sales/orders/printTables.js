import og from "./globals.js"
import { dateToString } from "../../generalFunctions.js"

async function printCustomerMovements(dataToPrint) {

    ordersLoader.style.display = 'block'
    cmppBody.innerHTML = ''
    let counter = 0
    const fragment = document.createDocumentFragment()  

    //printTable
    dataToPrint.forEach(element => {
        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const date = dateToString(element.date)
        
        const row = document.createElement('tr')
        row.innerHTML = `
            <th class="${rowClass}">${date}</th>
            <th class="${rowClass}">${element.type}</th>
            <th class="${rowClass}">${element.order_number}</th>
            <th class="${rowClass}">${og.formatter.format(element.total)}</th>            
            <th class="${rowClass}">${og.formatter.format(element.balance)}</th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    cmppBody.appendChild(fragment)

    ordersLoader.style.display = 'none'
}

async function printCustomerOrder(dataToPrint) {

    cbppBody.innerHTML = ''
    let counter = 0
    const fragment = document.createDocumentFragment()  

    //printTable
    dataToPrint.forEach(element => {

        if (element.confirmed_quantity != 0) {
            
            const rowClass = counter % 2 === 0 ? 'tBody3 tBodyEven' : 'tBody3 tBodyOdd'
        
            const row = document.createElement('tr')

            row.innerHTML = `
                <th class="${rowClass}">${element.confirmed_quantity || '' }</th>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${element.unit_price}</th>
            `
            fragment.appendChild(row)

            counter += 1
            
        }
        
    })

    cbppBody.appendChild(fragment)

}



export {printCustomerMovements,printCustomerOrder}