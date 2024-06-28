import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { dateToString } from "../../generalFunctions.js"

async function printTableOrdersDetails(dataToPrint) {

    ordersDetailsLoader.style.display = 'block'
    bodyOrdersDetails.innerHTML = ''
    let counter = 0

    //printTable
    dataToPrint.forEach(element => {
        
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const orderData = element.orders_details_orders
        const date = dateToString(orderData.date)
        
        const requiredQuantity = element.required_quantity == null ? '' : element.required_quantity
        const confirmedQuantity = element.required_quantity == null ? '' : element.confirmed_quantity

        //print table
        const line1 = '<th class="' + rowClass + '">' + orderData.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + orderData.orders_sales_channels.sales_channel + '</th>'
        const line4 = '<th class="' + rowClass + '">' + orderData.orders_customers.customer_name + '</th>'
        const line5 = '<th class="' + rowClass + '">' + element.description + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.size + '</th>'
        const line7 = '<th class="' + rowClass + '">' + element.color + '</th>'
        const line8 = '<th class="' + rowClass + '">' + element.unit_price + '</th>'
        const line9 = '<th class="' + rowClass + '">' + requiredQuantity + '</th>'
        const line10 = '<th class="' + rowClass + '">' + confirmedQuantity + '</th>'
        const line11 = '<th class="' + rowClass + '">' + orderData.orders_orders_status.order_status + '</th>'
        const line12 = '<th class="' + rowClass + '">' + orderData.orders_orders_managers.order_manager_name + '</th>'
        const line13 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line14 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></i></th>'

        bodyOrdersDetails.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line14 + '</tr>'

        counter += 1

    })

    //addOrdersEventListeners(dataToPrint)

    ordersDetailsLoader.style.display = 'none'
}

function addOrdersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const payment = document.getElementById('payment_' + element.id)
        const deliverOrder = document.getElementById('deliver_' + element.id)
        const assignOrder = document.getElementById('assign_' + element.id)
        const cancelOrder = document.getElementById('cancel_' + element.id)
        const customer = element.orders_customers.customer_name

        //payment
        if (payment) {
            payment.addEventListener('click',async()=>{

                //find customer positive balance and show checkbox if applies
                let positiveBalance = await (await fetch(dominio + 'apis/sales/customer-positive-balance/' + element.id_customers)).json()

                if (positiveBalance > 0) {
                    og.orderToPayCustomerBalance = positiveBalance
                    rpppUseBalanceLabel.innerText = 'Usar saldo a favor (ARS ' + og.formatter.format(positiveBalance) + ')'
                    rpppUseBalance.classList.remove('notVisible')
                }else{
                    rpppUseBalance.classList.add('notVisible')
                    og.orderToPayCustomerBalance = 0
                }

                //complete elements and globals data
                og.orderToPay = element
                rpppSubtotal.value = og.formatter.format(element.subtotal)
                rpppDiscount.value = og.formatter.format(element.discount * 100) + '%'
                rpppTotal.value = og.formatter.format(element.total)
                rpppPaid.value = og.formatter.format(element.amountPaid)
                rpppBalance.value = og.formatter.format(element.balance)
                rpppBalanceUsed.value = og.formatter.format(0)
                rpppNewBalance.value = og.formatter.format(element.balance)
                rpppBalanceAlert.innerHTML = ''
                rpppUseBalanceCheck.checked = false
                clearInputs(og.rpppValidate)
                rppp.style.display = 'block'
            })
        }

        //deliver order
        if (deliverOrder) {
            deliverOrder.addEventListener('click',async()=>{
                og.idOrderToDeliver = element.id
                doppQuestion.innerHTML = '¿Confirma que desea entregar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                dopp.style.display = 'block'
            })
        }

        //assign manager
        if (assignOrder) {
            assignOrder.addEventListener('click',async()=>{
                amppSelectOM.value = element.id_orders_managers
                og.idOrderToAssign = element.id
                ampp.style.display = 'block'
            })
        }

        //cancel order
        if (cancelOrder) {
            cancelOrder.addEventListener('click',async()=>{
                og.idOrderToCancel = element.id
                coppQuestion.innerHTML = '¿Confirma que desea cancelar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                copp.style.display = 'block'
            })
        }

    })

}

// function filterOrders() {

//     og.ordersFiltered = og.orders

//     //customer
//     const idCustomer = filterCustomer.value == 'default' ? '' :og.customers.filter(c => c.customer_name == filterCustomer.value)[0].id
//     og.ordersFiltered = filterCustomer.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_customers == idCustomer)

//     //order
//     og.ordersFiltered = filterOrder.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.order_number == filterOrder.value)

//     //order_manager
//     og.ordersFiltered = filterOrderManager.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_managers == filterOrderManager.value)

//     //order_status
//     og.ordersFiltered = filterOrderStatus.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_orders_status == filterOrderStatus.value)

//     //order_status
//     og.ordersFiltered = filterPaymentStatus.value == 'default' ? og.ordersFiltered : og.ordersFiltered.filter(o => o.id_payments_status == filterPaymentStatus.value)

//     //sales channels
//     if (og.checkedElements.length == 0) {
//         og.ordersFiltered = []
//     }else{
//         const channels = og.checkedElements.map(input => input.id)
//         og.ordersFiltered = og.ordersFiltered.filter(o => channels.some(channel => o.sales_channel.includes(channel)))
//     }


// }

// async function predictProducts() {    

//     if (selectProduct.value.length >= 3) {

//         let id = 0
        
//         const string = selectProduct.value.toLowerCase()
//         og.predictedProducts = await (await fetch(dominio + 'apis/data/products/predict-products/' + string)).json()

//         predictedProductsList.innerHTML = ''

//         og.predictedProducts.forEach(element => {
//             predictedProductsList.innerHTML += '<li class="liPredictedProducts" id="product_'+ id +'">' + element.description + '</li>'
//             id += 1
//         })

//         og.productFocused = -1

//         if (og.predictedProducts.length > 0) {
//             predictedProductsList.style.display = 'block'
            
//             for (let i = 0; i < og.predictedProducts.length; i++) {

//                 const predictedProduct = document.getElementById('product_' + i)
                
//                 predictedProduct.addEventListener("mouseover", async() => {

//                     //unfocus all elements
//                     for (let j = 0; j < og.predictedProducts.length; j++) {
//                         const predictedProduct = document.getElementById('product_' + j)
//                         if (j == i ) {
//                             predictedProduct.classList.add('predictedProductFocused')
//                         }else{
//                             predictedProduct.classList.remove('predictedProductFocused')
//                         }                            
//                     }
//                 })
                
//                 predictedProduct.addEventListener("click", async() => {
//                     productSelected(predictedProduct.innerText)                      
//                 })
//             }
//         }

//     }else{
//         og.productFocused = -1
//         predictedProductsList.style.display = 'none'
//         predictedProductsList.innerHTML = ''
//     }

// }

// function selectFocusedProduct(e) {
//     if (e.key === 'ArrowDown' && og.predictedProducts.length > 0) {
            
//         og.productFocused = (og.productFocused == og.predictedProducts.length-1) ? og.productFocused : (og.productFocused + 1)            
        
//         og.elementToFocus = document.getElementById('product_' + og.productFocused)            
//         og.elementToFocus.classList.add('predictedProductFocused')
//         og.elementToFocus.scrollIntoView({
//             behavior: 'smooth',
//             block: 'nearest'
//         })

//         if (og.productFocused > 0) {
//             og.elementToUnfocus = document.getElementById('product_' + (og.productFocused-1))
//             og.elementToUnfocus.classList.remove('predictedProductFocused')                
//         }

//     }else if(e.key === 'ArrowUp'){

//         og.productFocused = (og.productFocused == 0) ? og.productFocused : (og.productFocused - 1)

//         og.elementToFocus = document.getElementById('product_' + og.productFocused)            
//         og.elementToFocus.classList.add('predictedProductFocused')
//         og.elementToFocus.scrollIntoView({
//             behavior: 'smooth',
//             block: 'nearest'
//         })

//         if (og.productFocused != -1) {
//             og.elementToUnfocus = document.getElementById('product_' + (og.productFocused+1))
//             og.elementToUnfocus.classList.remove('predictedProductFocused')                
//         }
        
//     }else if(e.key === 'Enter'){

//         if (og.productFocused == -1) {
//             selectProduct.value = ''
//             selectSize.innerHTML = '<option value="default" id="selectSizeDefault" selected></option>'
//             colorsRow.classList.add('notVisible')
//             hideColorsInputs()
//         }else{
//             productSelected(og.elementToFocus.innerText)
            
//         }
        
//         predictedProductsList.style.display = 'none'
//     }
// }

// async function productSelected(selectedProduct) {

//     selectProduct.value = selectedProduct
//     selectSize.innerHTML = '<option value="default" id="selectSizeDefault" selected></option>'
        
//     const productOptions = await (await fetch(dominio + 'apis/cuttings/product-options/' + selectProduct.value)).json()

//     productOptions.sizes.forEach(size => {
//         selectSize.innerHTML += '<option value=' + size + '>' + size +'</option>'        
//     })

//     predictedProductsList.style.display = 'none'
    
//     //hide colors row
//     colorsRow.classList.add('notVisible')
//     hideColorsInputs()
    
// }

// function hideColorsInputs() {
//     for (let i = 0; i < 8; i++) {
//         const inputToHide = document.getElementById('inputColor' + i)
//         const labelToHide = document.getElementById('color' + i + 'Label')
//         inputToHide.classList.add('notVisible')
//         labelToHide.innerText = ''
//     }
// }

// async function getColorsOptions() {

//     const selectedProduct = selectProduct.value
//     const selectedSize = selectSize.value

//     if (selectedProduct != 'default' && selectedSize != 'default') {
//         const colorsOptions = await (await fetch(dominio + 'apis/cuttings/colors-options/' + selectedProduct + '/' + selectedSize)).json()
//         og.colorsOptions = colorsOptions.colors
        
//         //hide colors inputs
//         hideColorsInputs()

//         //show inputs
//         for (let i = 0; i < og.colorsOptions.length; i++) {
//             const inputToShow = document.getElementById('inputColor' + i)
//             const labelToShow = document.getElementById('color' + i + 'Label')
//             inputToShow.classList.remove('notVisible')

//             labelToShow.innerHTML = og.colorsOptions[i] + '<input type="checkbox" name ="" id="color' + i + 'LabelCheck" value="' + og.colorsOptions[i] + '">'
            
//         }

//         //show colors row
//         colorsRow.classList.remove('notVisible')

//     }else{
//         colorsRow.classList.add('notVisible')
//     }
// }

// function updateOrderData() {

//     og.orderData.subtotal = 0

//     og.orderDetails.forEach(element => {
//         og.orderData.subtotal += element.extended_price
//     })

//     og.orderData.total = og.orderData.subtotal * (1-og.orderData.discount)

//     orderInfo.innerHTML = ''
//     orderInfo.innerHTML += '<div class="orderInfoElement"><b>Subtotal:</b> $' + og.formatter.format(og.orderData.subtotal) +'</div>'
//     orderInfo.innerHTML += '<div class="orderInfoElement orderInfoWithIcon"><b>Descuento:</b> ' + og.formatter.format(og.orderData.discount * 100) + '%<div><i class="fa-solid fa-pencil pointer" id="cdppDiscount"></i></idv></div>'
//     orderInfo.innerHTML += '<div class="orderInfoElement"><b>Total:</b> $' +og.formatter.format( og.orderData.total) + '</div>'

//     //createEdit order - change discount
//     cdppDiscount.addEventListener("click", async() => {
//         cdppNewDiscount.value = og.discount * 100
//         cdpp.style.display = 'block'
//     })

// }

// function printTableCreateEdit() {

//     bodyCreateEdit.innerHTML = ''

//     let counter = 0

//     //printTable
//     og.orderDetails.forEach(element => {

//         const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

//         //print table
//         const line1 = '<th class="' + rowClass + '">' + element.description + '</th>'
//         const line2 = '<th class="' + rowClass + '">' + element.color + '</th>'
//         const line3 = '<th class="' + rowClass + '">' + element.size + '</th>'        
//         const line4 = '<th class="' + rowClass + '">' + og.formatter.format(element.unit_price) + '</th>'
//         const line5 = '<th class="' + rowClass + '">' + element.quantity + '</th>'
//         const line6 = '<th class="' + rowClass + '">' + og.formatter.format(element.extended_price) + '</th>'
//         const line7 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></th>'
//         const line8 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></th>'

//         bodyCreateEdit.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + '</tr>'

//         counter += 1

//     })

//     addCreateEditEventListeners()
    
// }

// function addCreateEditEventListeners() {

//     og.orderDetails.forEach(element => {

//         const deleteRow = document.getElementById('delete_' + element.id)
//         const editRow = document.getElementById('edit_' + element.id)
        
//         //delete
//         deleteRow.addEventListener('click',async()=>{
//             og.orderDetails = og.orderDetails.filter(data => data.id !== element.id)
//             updateOrderData()
//             printTableCreateEdit()
//         })

//         //edit
//         editRow.addEventListener('click',async()=>{

//             const productData = og.orderDetails.filter(product => product.id == element.id)[0]

//             eodppTitle.innerText = productData.description + ' - ' + productData.color + ' - ' + productData.size

//             //clear errors
//             clearInputs([eodppPrice])

//             eodppPrice.value = element.unit_price
//             eodppQty.value = element.quantity

//             og.idOrderDetailsToEdit = productData.id

//             //show popup
//             eodpp.style.display = 'block'

//         })

//     })
    



export {printTableOrdersDetails}