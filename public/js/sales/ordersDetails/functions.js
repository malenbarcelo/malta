import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { printOrdersDetails } from "./printOrdersDetails.js"

async function getData() {

    //get data and complete globals
    odg.season = await (await fetch(dominio + 'apis/main/current-season')).json()
    odg.userLogged = userLogged.innerText
    odg.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    odg.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + odg.season.season)).json()
    odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
    odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
    odg.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    odg.elementsToPredict[1].apiUrl = 'apis/cuttings/products/predict-season-products/' + odg.season.season + '/'
    odg.elementsToPredict[2].apiUrl = 'apis/cuttings/products/predict-season-products/' + odg.season.season + '/'
    odg.ordersDetailsFiltered = odg.ordersDetails
}

function applyFilters() {

    const date1 = Date.now()

    odg.ordersDetailsFiltered = odg.ordersDetails

    // order
    console.log(filterOrder.value)
    odg.ordersDetailsFiltered = filterOrder.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.order_number == filterOrder.value)

    // customer
    odg.ordersDetailsFiltered = filterCustomer.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.orders_customers.customer_name.toLowerCase().includes(filterCustomer.value.toLowerCase()))

    // product
    odg.ordersDetailsFiltered = filterProduct.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.description.toLowerCase().includes(filterProduct.value.toLowerCase()))

    // channel
    odg.ordersDetailsFiltered = filterChannel.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_sales_channels == filterChannel.value)

    // order_status
    if (filterOrderStatus.value == 'default') {
        odg.ordersDetailsFiltered = odg.ordersDetailsFiltered
    }else{
        if (filterOrderStatus.value == 'complete') {
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_orders_status == 2)
        }else{
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_orders_status == 1)
        }
    }

    // item status
    if (filterItemStatus.value == '') {
        odg.ordersDetailsFiltered = odg.ordersDetailsFiltered
    }else{
        if (filterItemStatus.value == 'complete') {
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity != '' && o.confirmed_quantity != null && o.confirmed_quantity != 0)
        }else{
            odg.ordersDetailsFiltered = odg.ordersDetailsFiltered.filter(o => o.confirmed_quantity == '' || o.confirmed_quantity == null || o.confirmed_quantity == 0)
        }
    }

    //order_manager
    odg.ordersDetailsFiltered = filterOrderManager.value == 'default' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.id_orders_managers == filterOrderManager.value)

    // //date from
    // odg.ordersDetailsFiltered = filterFrom.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.date >= filterFrom.value)

    // //date until
    // odg.ordersDetailsFiltered = filterUntil.value == '' ? odg.ordersDetailsFiltered : odg.ordersDetailsFiltered.filter(o => o.orders_details_orders.date <= filterUntil.value)

    const date2 = Date.now()

    console.log('filtros: ' + (date2-date1))

}

function updateTableData() {
    const total = odg.ordersDetailsFiltered.reduce((acc, i) => acc + parseFloat(i.extended_price,2), 0)
    const quantity = odg.ordersDetailsFiltered.reduce((acc, i) => acc + (i.confirmed_quantity ? parseFloat(i.confirmed_quantity,2) : 0), 0)
    totalAmount.innerHTML = '<div><b>TOTAL $:</b> $ ' + odg.formatter.format(total,2) + '</div>'
    itemsQuantity.innerHTML = '<div><b>CANTIDAD DE ITEMS:</b> ' + quantity + '</div>'
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

export {getData, applyFilters, completeELCPPcolors, completeELSPPsizes, updateTableData}