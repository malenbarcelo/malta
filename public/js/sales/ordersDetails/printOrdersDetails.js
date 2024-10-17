import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { dateToString, clearInputs } from "../../generalFunctions.js"

async function printOrdersDetails() {

    ordersDetailsLoader.style.display = 'block'
    bodyOrdersDetails.innerHTML = ''
    let counter = 0

        //printTable
        odg.ordersDetailsFiltered.forEach(element => {
            
            const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
            const orderData = element.orders_details_orders
            const date = dateToString(orderData.date)
            const colors = (element.colors.map(c => c.color_data.color)).join(', ')
            const sizes = (element.sizes.map(s => s.size_data.size)).join(', ')
            const requiredQuantity = element.required_quantity == null ? '' : element.required_quantity
            const confirmedQuantity = element.confirmed_quantity == null ? '' : element.confirmed_quantity
            const commentIcon = (element.observations2 == '' || element.observations2 == null) ? 'fa-comment' : 'fa-comment-dots'

            //print table
            const line1 = '<th class="' + rowClass + '">' + orderData.order_number + '</th>'
            const line2 = '<th class="' + rowClass + '">' + date + '</th>'
            const line3 = '<th class="' + rowClass + '">' + orderData.orders_sales_channels.sales_channel + '</th>'
            const line4 = '<th class="' + rowClass + '">' + orderData.orders_customers.customer_name + '</th>'
            const line5 = '<th class="' + rowClass + '">' + element.description + '</th>'
            const line6 = '<th class="' + rowClass + '">' + sizes + '</th>'
            const line7 = '<th class="' + rowClass + '">' + colors + '</th>'
            const line8 = '<th class="' + rowClass + '">' + element.unit_price + '</th>'
            const line9 = '<th class="' + rowClass + '">' + requiredQuantity + '</th>'
            const line10 = '<th class="' + rowClass + '">' + confirmedQuantity + '</th>'
            const line11 = '<th class="' + rowClass + ' ' + (orderData.id_orders_status == 1 ? 'errorColor': null) + '">' + orderData.orders_orders_status.order_status + '</th>'
            //const line12 = '<th class="' + rowClass + '">' + orderData.orders_orders_managers.order_manager_name + '</th>'
            const line13 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
            const line14 = '<th class="' + rowClass + '"><i class="fa-regular ' + commentIcon + ' allowedIcon" id="obs_' + element.id + '"></i></th>'
            const line15 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></i></th>'
            

            bodyOrdersDetails.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line13 + line14 + line15 + '</tr>'

            counter += 1

        })

    ordersDetailsEventListeners()

    ordersDetailsLoader.style.display = 'none'
}

function ordersDetailsEventListeners() {

    odg.ordersDetailsFiltered.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const deleteLine = document.getElementById('delete_' + element.id)
        const obs = document.getElementById('obs_' + element.id)

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