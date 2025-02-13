import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { dateToString, clearInputs } from "../../generalFunctions.js"
import { updateTableData } from "./functions.js"

// async function printOrdersDetails() {

//     const date1 = Date.now()

//     ordersDetailsLoader.style.display = 'block'
//     bodyOrdersDetails.innerHTML = ''
//     let counter = 0

//         //printTable
//         odg.ordersDetailsFiltered.forEach(element => {
            
//             const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
//             const orderData = element.orders_details_orders
//             // Obtener la fecha
//             let date = new Date(element.update_at)

//             // Formatear la fecha y hora en formato legible
//             let formattedDate = date.toLocaleString('es-AR', {
//                 year: 'numeric',
//                 month: '2-digit',
//                 day: '2-digit',
//                 hour: '2-digit',
//                 minute: '2-digit',
//                 second: '2-digit',
//                 hour12: false
//             })

//             const colors = (element.colors.map(c => c.color_data.color)).join(', ')
//             const sizes = (element.sizes.map(s => s.size_data.size)).join(', ')
//             const requiredQuantity = element.required_quantity == null ? '' : element.required_quantity
//             const confirmedQuantity = element.confirmed_quantity == null ? '' : element.confirmed_quantity
//             const commentIcon = (element.observations2 == '' || element.observations2 == null || element.observations2.trim() === '') ? 'fa-comment' : 'fa-comment-dots'

//             //print table
//             const line1 = '<th class="' + rowClass + '">' + orderData.order_number + '</th>'
            
//             const line3 = '<th class="' + rowClass + '">' + orderData.orders_sales_channels.sales_channel + '</th>'
//             const line4 = '<th class="' + rowClass + '">' + orderData.orders_customers.customer_name + '</th>'
//             const line5 = '<th class="' + rowClass + '">' + element.description + '</th>'
//             const line6 = '<th class="' + rowClass + '">' + sizes + '</th>'
//             const line7 = '<th class="' + rowClass + '">' + colors + '</th>'
//             const line8 = '<th class="' + rowClass + '">' + element.unit_price + '</th>'            
//             const line9 = '<th class="' + rowClass + '">' + confirmedQuantity + '</th>'
//             const line10 = '<th class="' + rowClass + '">' + requiredQuantity + '</th>'
//             const line11 = '<th class="' + rowClass + '">' + odg.formatter.format(parseFloat(element.extended_price,2)) + '</th>'
//             const line12 = '<th class="' + rowClass + ' ' + (orderData.id_orders_status == 1 ? 'errorColor': null) + '">' + orderData.orders_orders_status.order_status + '</th>'
//             const line2 = '<th class="' + rowClass + '">' + formattedDate.replace(',','') + '</th>'
//             //const line12 = '<th class="' + rowClass + '">' + orderData.orders_orders_managers.order_manager_name + '</th>'
//             const line13 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
//             const line14 = '<th class="' + rowClass + '"><i class="fa-regular ' + commentIcon + ' allowedIcon" id="obs_' + element.id + '"></i></th>'
//             const line15 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></i></th>'
            

//             bodyOrdersDetails.innerHTML += '<tr id="tr_' + element.id + '">' + line1 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line2 + line13 + line14 + line15 + '</tr>'

//             counter += 1

//         })

//     ordersDetailsEventListeners()
//     updateTableData()

//     ordersDetailsLoader.style.display = 'none'

//     const date2 = Date.now()

//     console.log(date2-date1)
// }

async function printOrdersDetails() {
    const date1 = Date.now()

    ordersDetailsLoader.style.display = 'block'
    bodyOrdersDetails.innerHTML = ''
    
    let counter = 0
    const fragment = document.createDocumentFragment()

    odg.ordersDetailsFiltered.forEach(element => {
        const row = document.createElement('tr')
        row.id = `tr_${element.id}`
        row.className = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        const orderData = element.orders_details_orders
        const formattedDate = new Date(element.update_at).toLocaleString('es-AR', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: false
        }).replace(',', '')

        const colors = element.colors.map(c => c.color_data.color).join(', ')
        const sizes = element.sizes.map(s => s.size_data.size).join(', ')
        const requiredQuantity = element.required_quantity ?? ''
        const confirmedQuantity = element.confirmed_quantity ?? ''
        const commentIcon = (!element.observations2 || element.observations2.trim() === '') ? 'fa-comment' : 'fa-comment-dots'
        const orderStatusClass = orderData.id_orders_status == 1 ? 'errorColor' : ''

        row.innerHTML = `
            <th>${orderData.order_number}</th>
            <th>${orderData.orders_sales_channels.sales_channel}</th>
            <th>${orderData.orders_customers.customer_name}</th>
            <th>${element.description}</th>
            <th>${sizes}</th>
            <th>${colors}</th>
            <th>${element.unit_price}</th>
            <th>${confirmedQuantity}</th>
            <th>${requiredQuantity}</th>
            <th>${odg.formatter.format(parseFloat(element.extended_price, 2))}</th>
            <th class="${orderStatusClass}">${orderData.orders_orders_status.order_status}</th>
            <th>${formattedDate}</th>
            <th><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th><i class="fa-regular ${commentIcon} allowedIcon" id="obs_${element.id}"></i></th>
            <th><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
        `
        
        fragment.appendChild(row)
        counter++
    })

    bodyOrdersDetails.appendChild(fragment)  // Inserta todo de una vez

    ordersDetailsEventListeners()
    updateTableData()

    ordersDetailsLoader.style.display = 'none'

    console.log(Date.now() - date1)  // Tiempo de ejecución
}

function ordersDetailsEventListeners() {

    odg.ordersDetailsFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const deleteLine = document.getElementById('delete_' + element.id)
        const obs = document.getElementById('obs_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        //edit line
        edit.addEventListener('click',async()=>{

            //clear errors
            clearInputs([elppPrice])

            odg.lineToEdit = element
            elppPrice.value = element.unit_price
            elppQtyR.value = element.required_quantity
            elppQtyC.value = element.confirmed_quantity
            elppTitle.innerText = element.description

            //complete sizes
            const sizes = (element.sizes.map(s => s.size_data.size)).join(', ')
            elppSizes.value = sizes
            odg.productSizes = element.product_data.product_sizes
            odg.selectedSizes = element.sizes  
            if (element.product_data.product_sizes[0].size_data.size == 'U') {
                elppChangeSizes.style.display = 'none'
            }else{
                elppChangeSizes.style.display = 'flex'
            }
            
            //complete colors
            const colors = (element.colors.map(c => c.color_data.color)).join(', ')
            odg.productColors = element.product_data.product_colors
            odg.selectedColors = element.colors                
            elppColors.innerText = element.product_data.product_colors.length == 0 ? 'U' : colors
            if (element.product_data.product_colors.length == 0) {
                elppChangeColors.style.display = 'none'
            }else{
                elppChangeColors.style.display = 'flex'
            }
                
            elpp.style.display = 'block'
            elppQtyC.focus()
            
        })

        //edit with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
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
            loppProduct.innerText = element.description
            lopp.style.display = 'block'         
        })
    })
}

export {printOrdersDetails}