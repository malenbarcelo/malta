import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import g from "../../globals.js"
import { getElements } from "./ordersGetElements.js"
import { printTableOrders, filterOrders, updateOrderData, printColorsOptions, printTableCreateEdit,changeSizesOptions } from "./ordersFunctions.js"
import { clearInputs, inputsValidation, isValid, showOkPopup, predictElements,selectFocusedElement, acceptWithEnter,selectWithClick } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get elements
    getElements()

    //get data and complete globals
    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.products = await (await fetch(dominio + 'apis/data/products')).json()
    og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    og.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    og.ordersPayments = await (await fetch(dominio + 'apis/sales/in-progress-orders/payments')).json()
    og.ordersFiltered = og.orders

    //print table
    printTableOrders(og.orders)

    //showCanceled
    showCanceled.addEventListener("click", async() => {
        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)
    })

    //filters event listeners
    og.filters1.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterOrders()
            printTableOrders(og.ordersFiltered)
        })
    })

    //filters customer error
    filterCustomer.addEventListener("change", async() => {
        if (filterCustomer.value != '') {
            filterCustomerLabel.classList.remove('errorColor')
            filterCustomer.classList.remove('isInvalid')
            DGAcreateOrderError.style.display = 'none'
        }
    })

    //filter customer event listener - predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        filterCustomer.value = ''
        filterOrder.value = 'default'
        filterOrderManager.value = 'default'
        filterOrderStatus.value = 'default'
        filterPaymentStatus.value = 'default'
        og.checks1.forEach(element => {
            element.checked = false
        })
        og.checkedElements = []
        printTableOrders(og.ordersFiltered)
    })

    //filter by channel
    og.checks1.forEach(element => {
        element.addEventListener("click", async() => {
            if (element.checked == true) {
                og.checkedElements.push(element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }else{
                og.checkedElements = og.checkedElements.filter(c => c != element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }
            selectChannelError.style.display = 'none'
        })
    })

    //close popups event listener
    const closePopups = [rpppClose,rpppCancel,doppClose,doppCancel,amppClose,amppCancel,coppClose,coppCancel,roppClose,roppCancel,cdppClose,cdppCancel,eodppClose,eodppCancel,scppCancel,scppClose,obppClose]
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'

            //select color popup exception
            if (element.id == 'scppCancel' || element.id == 'scppClose') {
                selectProduct.value = ''
                selectSize.innerHTML = '<option value="default" id="selectSizeDefault"></option>'            
            }
        })
    })

    //close side popups event listener
    og.closeSidePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.classList.remove('slideIn')
        })
    })

    //table info events listeners
    const tableIcons = [eoppIcon,rpppIcon,pvppIcon,doppIcon,amppIcon,obppIcon,coppIcon]
    tableIcons.forEach(element => {
        const info = document.getElementById(element.id.replace('Icon','Info'))
        element.addEventListener("mouseover", async(e) => {
            const mouseX = e.clientX
            info.style.left = (mouseX - 30) + 'px'
            info.style.display = 'block'
        })
        element.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    })

    //change amount paid
    og.rpppPaymentInputs.forEach(input => {

        input.addEventListener("change", async() => {

            const payment = rpppPayment.value == '' ? 0 :parseFloat(rpppPayment.value,2)
            const balanceUsed = og.orderToPayPayment.balanceUsed
            const totalPayment = parseFloat(payment,2) + parseFloat(balanceUsed,2)
            og.orderToPayPayment.payment = payment

            if (rpppPayment.value != '') {
                clearInputs([rpppPayment])
                rpppPayment.value = payment
            }

            if (og.orderToPay.balance < totalPayment) {
                rpppBalanceAlert.style.color = 'green'
                rpppBalanceAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><div>Quedará un saldo a favor de ARS ' + og.formatter.format(og.orderToPay.balance - totalPayment) + '</div>'
            }

            if (og.orderToPay.balance > totalPayment) {
                rpppBalanceAlert.style.color = 'rgb(206, 10, 10)'
                rpppBalanceAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><div>Quedará un saldo pendiente de ARS ' + og.formatter.format(og.orderToPay.balance - totalPayment) + '</div>'
            }

            if (og.orderToPay.balance == totalPayment || rpppPayment.value == '') {
                rpppBalanceAlert.innerHTML = ''
            }

            rpppNewBalance.value = og.formatter.format(og.orderToPay.balance - totalPayment)
            og.orderToPayNewBalance = og.orderToPay.balance - totalPayment

        })
    })

    //change payment method
    rpppPaymentMethod.addEventListener("change", async() => {
        const paymentMethod = rpppPaymentMethod.value
        if (rpppPaymentMethod.value != 'default') {
            clearInputs([rpppPaymentMethod])
            rpppPaymentMethod.value = paymentMethod
        }
    })

    //check use balance
    rpppUseBalanceCheck.addEventListener("click", async() => {

        if (rpppUseBalanceCheck.checked) {

            const orderBalance = og.orderToPay.balance
            const customerBalance = og.orderToPayCustomerBalance

            og.orderToPayPayment.balanceUsed = orderBalance > customerBalance ?  customerBalance :  orderBalance
            rpppBalanceUsed.value = og.formatter.format(og.orderToPayPayment.balanceUsed)

        }else{
            og.orderToPayPayment.balanceUsed = 0
            rpppBalanceUsed.value = 0
        }

    })

    //accept register payment
    rpppAccept.addEventListener("click", async() => {

        const errors = inputsValidation(og.rpppValidate)

        if (errors == 0) {

            const data = {
                orderToPay:og.orderToPay,
                amountPaid:og.orderToPayPayment,
                idPaymentMethod:rpppPaymentMethod.value,
                newBalance:og.orderToPayNewBalance
            }

            //register payment
            if (data.amountPaid.payment > 0) {
                await fetch(dominio + 'apis/sales/register-payment',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
            }

            //register current_account_movement
            if (data.amountPaid.balanceUsed > 0) {
                await fetch(dominio + 'apis/sales/register-account-movement',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
            }

            rppp.style.display = 'none'

            og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
            og.ordersPayments = await (await fetch(dominio + 'apis/sales/in-progress-orders/payments')).json()
            filterOrders()
            printTableOrders(og.ordersFiltered)

            showOkPopup(rpppOk)

        }
        
    })

    //accept deliver order
    doppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToDeliver}

        await fetch(dominio + 'apis/sales/deliver-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dopp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(doppOk)

    })

    //accept assign order manager
    amppAccept.addEventListener("click", async() => {

        const data = {
            idOrder:og.idOrderToAssign,
            orderManagerId:amppSelectOM.value
        }

        await fetch(dominio + 'apis/sales/assign-order-manager',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ampp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(amppOk)

    })

    //accept cancel order
    coppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToCancel}

        await fetch(dominio + 'apis/sales/cancel-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        copp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(coppOk)

    })

    //accept restore order
    roppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToRestore}

        await fetch(dominio + 'apis/sales/restore-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ropp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(roppOk)

    })

    //create order
    DGAcreateOrder.addEventListener("click", async() => {
        const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
        if (filterCustomer.value == '' || findCustomer.length == 0) {
            filterCustomerLabel.classList.add('errorColor')
            filterCustomer.classList.add('isInvalid')
            DGAordersErrors.style.display = 'flex'
            DGAcreateOrderError.style.display = 'block'
        }

        if (og.checkedElements.length == 0 || (og.checkedElements.length > 1 || (og.checkedElements[0].id !='channel_1' && og.checkedElements[0].id !='channel_2'))) {
            DGAordersErrors.style.display = 'flex'
            selectChannelError.style.display = 'block'
        }

        if (filterCustomer.value != 'default' && !(og.checkedElements.length == 0 || (og.checkedElements.length > 1 || (og.checkedElements[0].id !='channel_1' && og.checkedElements[0].id !='channel_2')))) {

            //clear data
            og.orderDetails = []
            printTableCreateEdit(og.orderDetails)

            //complete popup info
            const salesChannel = channel_1.checked ? 1 : 2
            const customer = filterCustomer.value
            const orderNumber = await (await fetch(dominio + 'apis/sales/new-order')).json()
            const customerData = og.customers.filter(c => c.customer_name == customer)[0]
            og.discount = customerData.discount
            const idCustomers = customerData.id
            og.orderData.discount = parseFloat(og.discount,2)
            og.orderData.subtotal = 0
            og.orderData.total = 0
            og.orderData.id_customers = idCustomers
            og.orderData.id_sales_channels = salesChannel
            og.orderData.order_number = orderNumber
            og.orderData.id = 'NA'
            og.action = 'create'
            ceoppTitle.innerText = 'CREAR PEDIDO'

            updateOrderData()

            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        }
    })

    //createEdit order - selectProduct - predict elements
    selectProduct.addEventListener("input", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        const elementName = 'product'
        predictElements(input,list,apiUrl,name,elementName)
    })

    selectProduct.addEventListener("keydown", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts
        const elementName = 'product'
        selectFocusedElement(e,input,list,elementName)
    })

    selectProduct.addEventListener("change", async(e) => {
        changeSizesOptions()
    })

    //createEdit order - selectsize
    selectSize.addEventListener("change", async() => {
        
        const selectedProduct = selectProduct.value
        const selectedSize = selectSize.value

        if (selectedProduct != 'default' && selectedSize != 'default') {
            const colorsOptions = await (await fetch(dominio + 'apis/cuttings/colors-options/' + selectedProduct + '/' + selectedSize)).json()
            og.colorsOptions = colorsOptions.colors

            printColorsOptions(og.colorsOptions)
            
            //show scpp
            scppTitle.innerText = selectedProduct + ' - TALLE ' + selectedSize
            selectAllColors.checked = false
            scppError.style.display = 'none'
            og.selectedColors = []
            scpp.style.display = 'block'
    
        }else{
            scpp.style.display = 'none'
        }

        
    })

    selectAllColors.addEventListener("click", async() => {
        if (selectAllColors.checked) {
            og.colorsOptions.forEach((color,i) => {
                const check = document.getElementById('check_' + i)
                check.checked = true
            })
        }else{
            og.colorsOptions.forEach((color,i) => {
                const check = document.getElementById('check_' + i)
                check.checked = false
            })
        }
    })

    //createEdit order - select colors accept
    scppAccept.addEventListener("click", async() => {

        og.colorsOptions.forEach((color,i) => {
            const check = document.getElementById('check_' + i)
            if (check.checked == true) {
                og.selectedColors.push({
                    i:i,
                    color:color
                })
            }
        })

        //validations
        if (og.selectedColors.length == 0) {
            scppError.style.display = 'block'
        }else{
            scppError.style.display = 'none'
            let id = og.orderDetails.length == 0 ? 1 : Math.max(...og.orderDetails.map(element => element.id)) + 1

            og.selectedColors.forEach((color) => {

                const product = og.products.filter( p => p.description == selectProduct.value && p.size == selectSize.value && p.color == color.color)[0]
                
                const unitPrice = product.unit_price
                const id_products = product.id
                const requiredInput = document.getElementById('required_' + color.i)
                const confirmedInput = document.getElementById('confirmed_' + color.i)
                
                og.orderDetails.push({
                    id: id,
                    id_products: id_products,
                    description: selectProduct.value,
                    size: selectSize.value,
                    color: color.color,
                    unit_price: parseFloat(unitPrice,2),
                    required_quantity: requiredInput.value,
                    confirmed_quantity: confirmedInput.value,
                    extended_price: confirmedInput.value == '' ? 0 : confirmedInput.value * unitPrice,
                    row_status: confirmedInput.value == '' ? 'Incompleto' : 'Completo'
                })
                id += 1
            })
            selectProduct.value = ''
            selectSize.value = ''
            scpp.style.display = 'none'
            updateOrderData()
            printTableCreateEdit()
        }

    })
    
    //createEdit order - edit discount
    cdppAccept.addEventListener("click", async() => {
        og.discount = cdppNewDiscount.value == '' ? 0 : cdppNewDiscount.value / 100
        og.orderData.discount = cdppNewDiscount.value == '' ? 0 : cdppNewDiscount.value / 100
        updateOrderData()
        cdpp.style.display = 'none'
    })

    //change discount with enter
    acceptWithEnter(cdppNewDiscount,cdppAccept)

    //createEdit order - edit order detals
    eodppAccept.addEventListener("click", async() => {

        const errors = inputsValidation([eodppPrice])
        
        if (errors == 0) {

            const unitPrice = eodppPrice.value
            const quantityR = eodppQtyR.value
            const quantityC = eodppQtyC.value
            const extendedPrice = unitPrice * quantityC            
            const id = og.idOrderDetailsToEdit

            og.orderDetails = og.orderDetails.map(element => {
                if (element.id == id) {
                  return {...element, unit_price: unitPrice, required_quantity: quantityR, confirmed_quantity: quantityC, extended_price: extendedPrice}
                }
                return element
            })

            updateOrderData()
            printTableCreateEdit()

            //close popup
           eodpp.style.display = 'none'
        }
    })

    //createEdit order - save order
    DGAsaveOrder.addEventListener("click", async() => {

        let incompleteRows = 0
        
        og.orderDetails.forEach(element => {
            if (element.row_status == 'Incompleto') {
                console.log(element)
                incompleteRows +=1
            }
        })

        if (incompleteRows > 0 || og.orderDetails.length == 0) {
            og.orderData.id_orders_status = 1
        }else{
            og.orderData.id_orders_status = 2
        }

        const data = og.orderData
        data.order_details = og.orderDetails

        if (og.action == 'create') {
            await fetch(dominio + 'apis/sales/save-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }else{
            await fetch(dominio + 'apis/sales/edit-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }
        
        window.location.href = '/sales/in-progress-orders'

    })

    //save observations
    obppAccept.addEventListener("click", async() => {
        const data = {
            id: og.idOrderObservations,
            observations: obppObs.value
        }

        await fetch(dominio + 'apis/sales/edit-order-observations',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()

        filterOrders()
        printTableOrders(og.ordersFiltered)

        obpp.style.display = 'none'
        showOkPopup(obppOk)

    })


})
