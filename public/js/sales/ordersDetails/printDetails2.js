import { dominio } from "../../dominio.js"
import g from "./globals2.js"
import gg from "../../globals.js"
import { clearInputs } from "../../generalFunctions.js"

async function printDetails() {

    bodyOrdersDetails.innerHTML = ''

    console.log(g.details)
    
    let counter = 0
    const fragment = document.createDocumentFragment()
    
    g.details.forEach(element => {

        const row = document.createElement('tr')
        row.id = `tr_${element.id}`
        row.className = element.confirmed_quantity === '' || element.confirmed_quantity === null ? 'tBody1 tBodyIncomplete' : 'tBody1 tBodyComplete'
        
        const requiredQuantity = element.required_quantity ?? ''
        const confirmedQuantity = element.confirmed_quantity ?? ''
        const commentIcon = (!element.observations2 || element.observations2.trim() === '') ? 'fa-comment' : 'fa-comment-dots'
        //const statusClass = element.orders_details_orders.id_orders_status == 1 ? 'errorColor' : ''
        const statusClass = ''
        const dateString = element.update_at
        const date = new Date(dateString)

        const formatter = new Intl.DateTimeFormat('es-AR', {
        day: '2-digit', month: '2-digit', year: 'numeric',
        hour: '2-digit', minute: '2-digit', second: '2-digit',
        hour12: false
        })

        const formattedDate = formatter.format(date).replace(/\//g, '-')

        row.innerHTML = `
            <th>${element.orders_details_orders.order_number}</th>
            <th>${element.orders_details_orders.orders_sales_channels.sales_channel}</th>
            <th>${element.orders_details_orders.orders_customers.customer_name}</th>
            <th>${element.description}</th>
            <th>${gg.formatter.format(element.unit_price)}</th>
            <th>${confirmedQuantity}</th>
            <th>${requiredQuantity}</th>
            <th>${gg.formatter.format(element.extended_price)}</th>
            <th class="${statusClass}">${element.orders_details_orders.orders_orders_status.order_status}</th>
            <th>${formattedDate}</th>
            <th><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th><i class="fa-regular ${commentIcon} allowedIcon" id="obs_${element.id}"></i></th>
            <th><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
        `
        
        fragment.appendChild(row)
        counter++
    })

    bodyOrdersDetails.appendChild(fragment)

    ordersDetailsEventListeners()
}

function ordersDetailsEventListeners() {

    g.details.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const deleteLine = document.getElementById('delete_' + element.id)
        const obs = document.getElementById('obs_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        //edit line
        edit.addEventListener('click',async()=>{

            ordersDetailsLoader.style.display = 'block'

            //clear errors
            clearInputs([elppPrice])

            g.lineToEdit = element
            
            // get product colors and sizes
            const productColors = await (await fetch(`${dominio}apis/get/cuttings-products-colors?id_products=${element.id_products}`)).json()
            g.productColors = productColors.rows
            const productSizes = await (await fetch(`${dominio}apis/get/cuttings-products-sizes?id_products=${element.id_products}`)).json()
            g.productSizes = productSizes.rows

            // // get line colors and sizes
            // const lineColors = await (await fetch(`${dominio}apis/get/sales-orders-details-colors?id_orders_details=${element.id}`)).json()
            // g.lineColors = lineColors.rows
            // const lineSizes = await (await fetch(`${dominio}apis/get/sales-orders-details-sizes?id_orders_details=${element.id}`)).json()
            // g.lineSizes = lineSizes.rows

            //complete colors
            elppChangeColors.style.display = 'none'
            const colors = (g.productColors.map(c => c.color_data.color)).join(', ')
            elppColors.innerText = g.productColors.length == 0 ? 'U' : colors
            // if (g.lineColors.length == 0) {
            //     elppChangeColors.style.display = 'none'
            // }else{
            //     elppChangeColors.style.display = 'flex'
            // }

            //complete sizes
            elppChangeSizes.style.display = 'none'
            const sizes = (g.productSizes.map(s => s.size_data.size)).join(', ')
            elppSizes.value = sizes           
            // if (g.productSizes[0].size_data.size == 'U') {
            //     elppChangeSizes.style.display = 'none'
            // }else{
            //     elppChangeSizes.style.display = 'flex'
            // }
            
            
            
            elppPrice.value = element.unit_price
            elppQtyR.value = element.required_quantity
            elppQtyC.value = element.confirmed_quantity
            elppTitle.innerText = element.description
            elpp.style.display = 'block'
            elppQtyC.focus()

            ordersDetailsLoader.style.display = 'none'
            
        })

        //edit with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        //delete line        
        deleteLine.addEventListener('click',async()=>{
            g.lineToDelete = element
            dlppQuestion.innerHTML = '¿Confirma que desea eliminar el item <b>' + element.description + '</b> de la orden <b>' + element.orders_details_orders.order_number + '</b> del cliente <b>' + element.orders_details_orders.orders_customers.customer_name + '</b>'            
            dlpp.style.display = 'block'
        })

        //line observations
        obs.addEventListener('click',async()=>{
            g.lineToEdit = element
            loppObs.value = element.observations2
            loppProduct.innerText = element.description
            lopp.style.display = 'block'         
        })
    })
}

export { printDetails }