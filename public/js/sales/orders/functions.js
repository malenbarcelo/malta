import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { printOrders } from "./printOrders.js"
import { dateToString,isValid,isInvalid } from "../../generalFunctions.js"


async function getData() {
    og.season = await (await fetch(dominio + 'apis/main/current-season')).json()
    og.userLogged = userLogged.innerText
    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    og.elementsToPredict[1].apiUrl = 'apis/cuttings/products/predict-season-products/' + og.season.season + '/'
    og.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + og.season.season)).json()
    og.productsTypes = await (await fetch(dominio + 'apis/cuttings/data/products-types')).json()
    og.fabrics = await (await fetch(dominio + 'apis/cuttings/data/fabrics')).json()
    og.colors = await (await fetch(dominio + 'apis/cuttings/data/colors')).json()
    og.sizes = await (await fetch(dominio + 'apis/cuttings/data/sizes')).json()
    og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json()
    og.ordersFiltered = og.orders   
    og.customersSummary = await (await fetch(dominio + 'apis/sales/customers/customers-summary')).json()
    og.paymentMethods = await (await fetch(dominio + 'apis/data/payment-methods')).json()
}

function applyFilters() {

    og.ordersFiltered = og.orders

    //show canceled
    og.ordersFiltered = showCanceled.checked ? og.ordersFiltered : og.ordersFiltered.filter(o => o.enabled != 0)    

    //customer
    let idCustomer = filterCustomer.value == '' ? '' : og.customers.filter(c => c.customer_name == filterCustomer.value)
    idCustomer = idCustomer.length == 0 ? 0 : idCustomer[0].id
    og.ordersFiltered = filterCustomer.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_customers == idCustomer)

    //order
    og.ordersFiltered = filterOrder.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.order_number == filterOrder.value)

    //order_manager
    og.ordersFiltered = filterOrderManager.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_managers == filterOrderManager.value)

    //order_status
    og.ordersFiltered = filterOrderStatus.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_status == filterOrderStatus.value)

    //order_status
    og.ordersFiltered = filterPaymentStatus.value == '' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_payments_status == filterPaymentStatus.value)

    //sales channels
    if (og.channelsChecked.length == 0) {
        og.ordersFiltered = og.ordersFiltered
    }else{
        const selectedChannels = og.channelsChecked.map(input => input.id)
        const channels = []
        
        selectedChannels.forEach(channel => {
            const channelId = parseInt(channel.split('_')[1])
            channels.push(channelId)
        })

        og.ordersFiltered  = og.ordersFiltered.filter(o => channels.includes(o.id_sales_channels))
    }

}

function updateOrdersData() {
    const total = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.total,2), 0)
    const amountPaid = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.amountPaid,2), 0)
    const balance = og.ordersFiltered.reduce((acc, i) => acc + parseFloat(i.balance,2), 0)
    orderTotal.innerHTML = '<div><b>TOTAL:</b> $ ' + og.formatter.format(total) + '</div>'
    ordersAmountPaid.innerHTML = '<div><b>PAGADO:</b> $ ' + og.formatter.format(amountPaid) + '</div>'
    ordersBalance.innerHTML = '<div><b>SALDO:</b> $ ' + og.formatter.format(balance) + '</div>'
}

async function updateCustomerData() {

    og.customersSummary = await (await fetch(dominio + 'apis/sales/customers/customers-summary')).json()

    if (filterCustomer.value != '') {
        og.customerData = og.customersSummary.filter(c => c.customer_name == filterCustomer.value)
        const customerPositiveBalance = og.customerData.length > 0 ? og.customerData[0].positiveBalance : 0
        const customerNotes = og.customerData.length > 0 ? og.customerData[0].notes : null

        //balance
        if (customerPositiveBalance > 0) {
            positiveBalance.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><b>SALDO A FAVOR: </b>$' + og.formatter.format(customerPositiveBalance);
            positiveBalance.style.color = 'green'
            positiveBalance.style.display = 'block';
        } else if (customerPositiveBalance < 0) {
            positiveBalance.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><b>SALDO EN CONTRA: </b>$' + og.formatter.format(customerPositiveBalance);
            positiveBalance.style.color = 'var(--errorColor)'
            positiveBalance.style.display = 'block';
        } else {
            positiveBalance.style.display = 'none';
        }

        //comments
        if (customerNotes == null || customerNotes =='') {
            notes.innerHTML = '<i class="fa-regular fa-comment"></i>'
        }else{
            notes.innerHTML = '<i class="fa-regular fa-comment-dots"></i>'
        }
        
        if (og.customerData.length > 0) {
            notes.style.display = 'block'
        }else{
            notes.style.display = 'none'
        }        
    }else{
        positiveBalance.style.display = 'none'
        notes.style.display = 'none'
    }
    
}

function updateOrderData() {

    og.orderData.subtotal = 0

    og.orderDetails.forEach(element => {
        og.orderData.subtotal += element.enabled == 0 ? 0 : parseFloat(element.extended_price,2)
    })

    og.orderData.total = og.orderData.subtotal * (1-og.orderData.discount)

    orderInfo.innerHTML = ''
    orderInfo.innerHTML += '<div class="orderInfoElement"><b>Subtotal:</b> $' + og.formatter.format(og.orderData.subtotal) +'</div>'
    orderInfo.innerHTML += '<div class="orderInfoElement orderInfoWithIcon"><b>Descuento:</b> ' + og.formatter.format(og.orderData.discount * 100) + '%<div><i class="fa-solid fa-pencil pointer" id="chdppDiscount"></i></idv></div>'
    orderInfo.innerHTML += '<div class="orderInfoElement"><b>Total:</b> $' + og.formatter.format( og.orderData.total) + '</div>'

    //createEdit order - change discount
    chdppDiscount.addEventListener("click", async() => {
        chdppNewDiscount.value = og.orderData.discount * 100
        chdpp.style.display = 'block'
    })
}

function completeEPSPPsizes() {
    
    epsppSizes.innerHTML = ''
    
    og.productSizes.forEach(size => {
        const checked = (og.selectedSizes.filter( s => s.id_sizes == size.id_sizes)).length == 0 ? '' : 'checked'
        epsppSizes.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="size_' + size.id_sizes + '" ' + checked + '><label>' + size.size_data.size + '</label></div>'
    })

    //add event listeners
    og.productSizes.forEach(size => {
        const check = document.getElementById('size_' + size.id_sizes)
        check.addEventListener("click", () => {
            if (check.checked) {
                og.selectedSizes.push(size)
                
            }else{
                og.selectedSizes = og.selectedSizes.filter(s => s.id_sizes != size.id_sizes)
                
            }
        })
        
    })
}

function completeEPCPPcolors() {
    
    epcppColors.innerHTML = ''
    
    og.productColors.forEach(color => {
        const checked = (og.selectedColors.filter( c => c.id_colors == color.id_colors)).length == 0 ? '' : 'checked'
        epcppColors.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="color_' + color.id_colors + '" ' + checked + '><label>' + color.color_data.color + '</label></div>'
    })

    //add event listeners
    og.productColors.forEach(color => {
        const check = document.getElementById('color_' + color.id_colors)
        check.addEventListener("click", () => {
            if (check.checked) {
                og.selectedColors.push(color)
            }else{
                og.selectedColors = og.selectedColors.filter( c => c.id_colors != color.id_colors)
            }
        })
        
    })
}

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

function completeESPPsizes() {
    
    esppSizes.innerHTML = ''
    
    og.sizes.forEach(size => {        
        const checked = og.newProductSizes.filter(ps => ps.id == size.id).length == 0 ? '' : 'checked'
        esppSizes.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="size_' + size.id + '" ' + checked + '><label>' + size.size + '</label></div>'
    })

    //add event listeners
    og.sizes.forEach(size => {
        const check = document.getElementById('size_' + size.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                og.selectedSizes.push({id:size.id,size:size.size})
            }else{
                og.selectedSizes = og.selectedSizes.filter( ss => ss.id != size.id)
            }
        })
    })
}

function completeECPPcolors() {
    
    ecppColors.innerHTML = ''
    
    og.colors.forEach(color => {
        const checked = og.newProductColors.filter(nps => nps.id == color.id).length == 0 ? '' : 'checked'
        ecppColors.innerHTML += '<div class="divCheckbox1 divColor"><input type="checkbox" id="color_' + color.id + '" ' + checked + '><label>' + color.color + '</label></div>'
    })

    //add event listeners
    og.colors.forEach(color => {
        const check = document.getElementById('color_' + color.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                og.selectedColors.push({id:color.id,color:color.color})
            }else{
                og.selectedColors = og.selectedColors.filter( sc => sc.id != color.id)
            }
        })
    })

}

function cpppValidations() {
    let errors = 0
    const findType = og.productsTypes.filter(pt => pt.product_type.toLowerCase() == cpppType.value.toLowerCase())
    const findFabric = og.fabrics.filter(f => f.fabric.toLowerCase() == cpppFabric.value.toLowerCase())
    const findCode = og.products.filter(p => (p.product_code).toLowerCase() == cpppCode.value.toLowerCase() && p.season == og.season.season)

    if (findCode.length > 0 && og.codeToEdit != cpppCode.value) {
        errors += 1
        isInvalid([cpppCode])
        cpppCodeError.style.display = 'none'
        cpppCodeError2.style.display = 'block'
    }else{
        isValid([cpppCode])
        cpppCodeError.style.display = 'none'
        cpppCodeError2.style.display = 'none'
    }
    
    if (findType.length === 0) {
        errors += 1
        isInvalid([cpppType])
        cpppTypeError.style.display = 'none'
        cpppTypeError2.style.display = 'block'
    }else{
        isValid([cpppType])
        cpppTypeError.style.display = 'none'
        cpppTypeError2.style.display = 'none'
    }

    if (findFabric.length === 0) {
        errors += 1
        isInvalid([cpppFabric])
        cpppFabricError.style.display = 'none'
        cpppFabricError2.style.display = 'block'
    }else{
        isValid([cpppFabric])
        cpppFabricError.style.display = 'none'
        cpppFabricError2.style.display = 'none'
    }

    return errors
    
}

export {getData, updateOrdersData,updateOrderData, updateCustomerData,applyFilters, completeEPSPPsizes, completeEPCPPcolors, printCustomerMovements,completeESPPsizes,completeECPPcolors,cpppValidations}