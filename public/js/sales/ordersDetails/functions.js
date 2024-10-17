import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { printOrdersDetails } from "./printOrdersDetails.js"

async function getData() {

    //get data and complete globals
    odg.season = await (await fetch(dominio + 'apis/main/current-season')).json()
    odg.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    odg.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + odg.season.season)).json()
    odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
    odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
    odg.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    odg.elementsToPredict[1].apiUrl = 'apis/cuttings/products/predict-season-products/' + odg.season.season + '/'
    odg.ordersDetailsFiltered = odg.ordersDetails
    
    applyFilters()
    printOrdersDetails()
}

function applyFilters() {

    odg.ordersDetailsFiltered = odg.ordersDetails

    //order
    odg.ordersDetailsFiltered = filterOrder.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.order_number == filterOrder.value)

    //customer
    let idCustomer = filterCustomer.value == '' ? '' : odg.customers.filter(c => c.customer_name == filterCustomer.value)
    
    odg.ordersDetailsFiltered = filterCustomer.value == '' ? odg.ordersDetailsFiltered : (idCustomer.length == 0 ? [] : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_customers == idCustomer[0].id))

    //product
    odg.ordersDetailsFiltered = filterProduct.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.description == filterProduct.value)

    //order_status
    if (filterOrderStatus.value == 'default') {
        odg.ordersDetailsFiltered = odg.ordersDetailsFiltered
    }else{
        if (filterOrderStatus.value == 'complete') {
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity != null)
        }else{
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity == null)
        }
    }

    //order_manager
    odg.ordersDetailsFiltered = filterOrderManager.value == 'default' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_orders_managers == filterOrderManager.value)
}

function completeELSPPsizes() {
    
    elsppSizes.innerHTML = ''
    
    odg.productSizes.forEach(size => {
        const checked = (odg.selectedSizes.filter( s => s.id_sizes == size.id_sizes)).length == 0 ? '' : 'checked'
        elsppSizes.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="size_' + size.id_sizes + '" ' + checked + '><label>' + size.size_data.size + '</label></div>'
    })

    //add event listeners
    odg.productSizes.forEach(size => {
        const check = document.getElementById('size_' + size.id_sizes)
        check.addEventListener("click", () => {
            if (check.checked) {
                odg.selectedSizes.push(size)
            }else{
                odg.selectedSizes = odg.selectedSizes.filter( s => s.id_sizes != size.id_sizes)
            }
        })
    })
}

function completeELCPPcolors() {
    
    elcppColors.innerHTML = ''
    
    odg.productColors.forEach(color => {
        const checked = (odg.selectedColors.filter( c => c.id_colors == color.id_colors)).length == 0 ? '' : 'checked'
        elcppColors.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="color_' + color.id_colors + '" ' + checked + '><label>' + color.color_data.color + '</label></div>'
    })

    //add event listeners
    odg.productColors.forEach(color => {
        const check = document.getElementById('color_' + color.id_colors)
        check.addEventListener("click", () => {
            if (check.checked) {
                odg.selectedColors.push(color)
            }else{
                odg.selectedColors = odg.selectedColors.filter( c => c.id_colors != color.id_colors)
            }
        })
    })
}

export {getData, applyFilters, completeELCPPcolors, completeELSPPsizes}