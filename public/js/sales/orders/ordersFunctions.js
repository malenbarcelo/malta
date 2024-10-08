import { dominio } from "../../dominio.js"
import og from "./globals.js"
import g from "../../globals.js"
import { clearInputs, dateToString } from "../../generalFunctions.js"

function printColorsOptions(dataToPrint) {
    bodyColors.innerHTML = ''
    let counter = 0

    //printTable
    dataToPrint.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody2 tBodyEven' : 'tBody2 tBodyOdd'
        
        //print table
        const line1 = '<th class="' + rowClass + '"><div class="inputColor"><div class="colorCheck"><input type="checkbox" id="check_'+ counter + '"></div><div class="colorName">' + element + '</div></div></th>'
        const line2 = '<th class="' + rowClass + '"><input type="text" class="input2" id="required_'+ counter + '"></th>'
        const line3 = '<th class="' + rowClass + '"><input type="text" class="input2 highlightedInput" id="confirmed_'+ counter + '"></th>'

        bodyColors.innerHTML += '<tr>' + line1 + line2 + line3 + '</tr>'

        counter += 1

    })

    addColorsOptionsEventListeners(dataToPrint)
}

function addColorsOptionsEventListeners(dataToPrint) {

    let counter = 0

    dataToPrint.forEach(element => {

        const required = document.getElementById('required_' + counter)
        const confirmed = document.getElementById('confirmed_' + counter)
        const check = document.getElementById('check_' + counter)

        //required
        required.addEventListener('change',async()=>{
            if (required.value != '') {
                check.checked = true
            }
        })

        //confirmed
        confirmed.addEventListener('change',async()=>{
            if (confirmed.value != '') {
                check.checked = true
            }
        })

        counter += 1

    })

}

async function printTableOrders(dataToPrint) {

    ordersLoader.style.display = 'block'
    bodyOrders.innerHTML = ''
    let counter = 0

    //printTable
    dataToPrint.forEach(element => {

        const date = dateToString(element.date)
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        //const paymentClass = (element.enabled == 1 && element.id_orders_status != 1 && element.id_payments_status != 5) ? 'allowedIcon' : 'notAllowedIcon'
        const paymentClass = 'allowedIcon'
        const paymentVStatus = (element.enabled == 1 && element.id_orders_status != 1 && element.id_payments_status != 5) ? '' : 'disabled'
        const paymentVchequed = element.id_payments_status == 6 ? 'checked' : ''
        const deliverClass = (element.enabled == 1 && element.id_orders_status == 2) ? 'allowedIcon' : 'notAllowedIcon'
        const cancelClass = (element.id_orders_status == 1 || element.id_orders_status == 2) && (element.id_payments_status == 1 || element.id_payments_status == 2 || element.id_payments_status == 3) ? 'allowedIcon' : 'notAllowedIcon'
        const status = element.enabled == 0 ? 'Cancelado' : element.orders_orders_status.order_status
        const color = (element.enabled == 0) ? 'errorColor' : ''
        const cancelIcon = element.enabled == 1 ? 'fa-circle-xmark' : 'fa-circle-check'
        const cancelId = element.enabled == 1 ? 'cancel_' : 'restore_'
        const commentIcon = (element.observations == '' ||  element.observations == null) ? 'fa-comment' : 'fa-comment-dots'

        //print table
        const line1 = '<th class="' + rowClass + ' ' + color + '">' + element.order_number + '</th>'
        const line2 = '<th class="' + rowClass + ' ' + color +  '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + ' ' + color +  '">' + element.orders_sales_channels.sales_channel + '</th>'
        const line4 = '<th class="' + rowClass + ' ' + color +  '">' + element.orders_customers.customer_name + '</th>'
        const line5 = '<th class="' + rowClass + ' ' + color +  '">' + og.formatter.format(element.subtotal) + '</th>'
        const line6 = '<th class="' + rowClass + ' ' + color + '">' + Math.round(element.discount * 100) + '%' + '</th>'
        const line7 = '<th class="' + rowClass + ' ' + color + '">' + og.formatter.format(element.total) + '</th>'
        const line8 = '<th class="' + rowClass + ' ' + color + '">' + og.formatter.format(element.amountPaid) + '</th>'
        const line9 = '<th class="' + rowClass + ' ' + color + '">' + og.formatter.format(element.balance) + '</th>'
        const line10 = '<th class="' + rowClass + ' ' + (element.id_orders_status == 1 ? 'errorColor' : color) + '">' + status + '</th>'
        const line11 = '<th class="' + rowClass + ' ' + color + '">' + element.orders_payments_status.payment_status + '</th>'
        //const line12 = '<th class="' + rowClass + ' ' + color + '">' + element.orders_orders_managers.order_manager_name + '</th>'
        const line13 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></i></th>'
        const line14 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-regular fa-credit-card ' + paymentClass + '" id="' + (paymentClass == 'allowedIcon' ? ('payment_' + element.id) : null) +'"></i></th>'
        const line15 = '<th class="' + rowClass + ' ' + color + '"><input type="checkbox" id="paymentV_'+ element.id +'"' + ' ' + paymentVchequed + ' ' + paymentVStatus + '></th>'
        const line16 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-solid fa-truck-ramp-box ' + deliverClass + '" id="' + (deliverClass == 'allowedIcon' ? ('deliver_' + element.id) : null) +'"></i></th>'
        const line17 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-solid fa-user-pen allowedIcon" id="assign_' + element.id + '"></i></th>'
        const line18 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-regular ' + commentIcon + ' allowedIcon" id="obs_' + element.id + '"></i></th>'
        const line19 = '<th class="' + rowClass + ' ' + color + '"><i class="fa-regular ' + cancelIcon + ' ' + cancelClass + '" id="' + (cancelClass == 'allowedIcon' ? (cancelId + element.id) : null) +'"></i></th>'

        bodyOrders.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line13 + line14 + line15 + line16 + line17 + line18 + line19 + '</tr>'

        counter += 1

    })

    updateData(dataToPrint)
    addOrdersEventListeners(dataToPrint)

    ordersLoader.style.display = 'none'
}

function addOrdersEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const payment = document.getElementById('payment_' + element.id)
        const paymentV = document.getElementById('paymentV_' + element.id)
        const deliverOrder = document.getElementById('deliver_' + element.id)
        const assignOrder = document.getElementById('assign_' + element.id)
        const obs = document.getElementById('obs_' + element.id)
        const cancelOrder = document.getElementById('cancel_' + element.id)
        const restoreOrder = document.getElementById('restore_' + element.id)
        const customer = element.orders_customers.customer_name

        //edit
        edit.addEventListener("click", async() => {
                
            //clear data
            og.orderDetails = element.orders_orders_details
            printTableCreateEdit(og.orderDetails)
    
            //complete popup info
            const salesChannel = element.id_sales_channels
            const orderNumber = element.order_number
            og.discount = element.discount
            const idCustomers = element.id_customers
            const customer = element.orders_customers.customer_name
            og.orderData.discount = parseFloat(og.discount,2)
            og.orderData.subtotal = parseFloat(element.subtotal,2)
            og.orderData.total = parseFloat(element.total,2)
            og.orderData.id_customers = idCustomers
            og.orderData.id_sales_channels = salesChannel
            og.orderData.order_number = orderNumber
            og.orderDetails = element.orders_orders_details
            og.action = 'edit'
            og.orderData.id = element.id
            ceoppTitle.innerText = 'EDITAR PEDIDO'
    
            updateOrderData()

            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        })

        //payment
        if (payment) {
            payment.addEventListener('click',async()=>{

                //find customer positive balance and show checkbox if applies
                let positiveBalance = await (await fetch(dominio + 'apis/sales/payments-assignations/customer-assignations/' + element.id_customers)).json()

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

        //payment verification
        if (paymentV) {
            paymentV.addEventListener('click',async()=>{

                let data = {
                    orderId:element.id,
                    id_payments_status: element.amountPaid == 0 ? 3 : (element.balance > 0 ? 4 : 5)
                }

                if (paymentV.checked) {

                    //set payment verification
                    await fetch(dominio + 'apis/sales/set-payment-verification',{
                        method:'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    })
                }else{

                    //update payment status
                    await fetch(dominio + 'apis/sales/orders/update-payment-status',{
                        method:'POST',
                        headers: {'Content-Type': 'application/json'},
                        body: JSON.stringify(data)
                    })
                }

                og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
                filterOrders()
                printTableOrders(og.ordersFiltered)

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

        //restore order
        if (restoreOrder) {
            restoreOrder.addEventListener('click',async()=>{
                og.idOrderToRestore = element.id
                roppQuestion.innerHTML = '¿Confirma que desea reflotar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                ropp.style.display = 'block'
            })
        }

        //observations
        obs.addEventListener('click',async()=>{
            og.notesFrom = 'orders'
            obppTitle.innerText = 'Pedido #' + element.order_number + ' - OBSERVACIONES' 
            og.idOrderObservations = element.id
            obppObs.value = element.observations
            obpp.style.display = 'block'
        })
    })

}





async function predictProducts() {    

    if (selectProduct.value.length >= 3) {

        let id = 0
        
        const string = selectProduct.value.toLowerCase()
        og.predictedProducts = await (await fetch(dominio + 'apis/data/products/predict-products/' + string)).json()

        predictedProductsList.innerHTML = ''

        og.predictedProducts.forEach(element => {
            predictedProductsList.innerHTML += '<li class="liPredictedProducts" id="product_'+ id +'">' + element.description + '</li>'
            id += 1
        })

        og.productFocused = -1

        if (og.predictedProducts.length > 0) {
            predictedProductsList.style.display = 'block'
            
            for (let i = 0; i < og.predictedProducts.length; i++) {

                const predictedProduct = document.getElementById('product_' + i)
                
                predictedProduct.addEventListener("mouseover", async() => {

                    //unfocus all elements
                    for (let j = 0; j < og.predictedProducts.length; j++) {
                        const predictedProduct = document.getElementById('product_' + j)
                        if (j == i ) {
                            predictedProduct.classList.add('predictedProductFocused')
                        }else{
                            predictedProduct.classList.remove('predictedProductFocused')
                        }                            
                    }
                })
                
                predictedProduct.addEventListener("click", async() => {
                    productSelected(predictedProduct.innerText)                      
                })
            }
        }

    }else{
        og.productFocused = -1
        predictedProductsList.style.display = 'none'
        predictedProductsList.innerHTML = ''
    }

}

function selectFocusedProduct(e) {
    if (e.key === 'ArrowDown' && og.predictedProducts.length > 0) {
            
        og.productFocused = (og.productFocused == og.predictedProducts.length-1) ? og.productFocused : (og.productFocused + 1)            
        
        og.elementToFocus = document.getElementById('product_' + og.productFocused)            
        og.elementToFocus.classList.add('predictedProductFocused')
        og.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (og.productFocused > 0) {
            og.elementToUnfocus = document.getElementById('product_' + (og.productFocused-1))
            og.elementToUnfocus.classList.remove('predictedProductFocused')                
        }

    }else if(e.key === 'ArrowUp'){

        og.productFocused = (og.productFocused == 0) ? og.productFocused : (og.productFocused - 1)

        og.elementToFocus = document.getElementById('product_' + og.productFocused)            
        og.elementToFocus.classList.add('predictedProductFocused')
        og.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (og.productFocused != -1) {
            og.elementToUnfocus = document.getElementById('product_' + (og.productFocused+1))
            og.elementToUnfocus.classList.remove('predictedProductFocused')                
        }
        
    }else if(e.key === 'Enter'){

        if (og.productFocused == -1) {
            selectProduct.value = ''
            selectSize.innerHTML = '<option value="default" id="selectSizeDefault" selected></option>'
        }else{
            productSelected(og.elementToFocus.innerText)
            
        }
        
        predictedProductsList.style.display = 'none'
    }
}

async function changeSizesOptions() {

    selectSize.innerHTML = '<option value="default" id="selectSizeDefault"></option>'

    const data = {productDescription:selectProduct.value}
        
    const productOptions = await (
        await fetch(dominio + 'apis/cuttings/product-options/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
    ).json()

    if (productOptions.sizes.length == 1 && productOptions.sizes[0] == 'U') {
        selectSize.innerHTML += '<option value=' + 'U' + '>' + 'U' +'</option>'
        selectSize.value = 'U'
        const event = new Event('change')
        selectSize.dispatchEvent(event)
    }else{
        productOptions.sizes.forEach(size => {
            selectSize.innerHTML += '<option value=' + size + '>' + size +'</option>'        
        })
    }
    
}




    


export {printTableOrders, filterOrders, predictProducts, selectFocusedProduct, updateOrderData, printColorsOptions,changeSizesOptions}