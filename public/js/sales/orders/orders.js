import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import { getElements } from "./ordersGetElements.js"
import { printTableOrders, filterOrders } from "./ordersFunctions.js"
import { clearInputs, inputsValidation, showOkPopup } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get elements
    getElements()

    //get data and complete globals
    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.products = await (await fetch(dominio + 'apis/data/products')).json()
    og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    og.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    og.ordersPayments = await (await fetch(dominio + 'apis/sales/in-progress-orders/payments')).json()
    og.ordersFiltered = og.orders
    og.checkedElements = og.checks1

    //print table
    printTableOrders(og.orders)

    //filters event listeners
    og.filters1.forEach(filter => {
        
        filter.addEventListener("change", async() => {
            filterOrders()
            printTableOrders(og.ordersFiltered)
        })
        
    })

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        filterCustomer.value = 'default'
        filterOrder.value = 'default'
        filterOrderManager.value = 'default'
        filterOrderStatus.value = 'default'
        allChannels.checked = true
        og.checks1.forEach(element => {
            element.checked = true
        })
        printTableOrders(og.ordersFiltered)
    })

    //view allChannels event lister
    allChannels.addEventListener("click", async() => {
        if (allChannels.checked) {
            og.checkedElements = og.checks1
            filterOrders()
            printTableOrders(og.ordersFiltered)
        }else{
            og.checkedElements = []
            filterOrders()
            printTableOrders(og.ordersFiltered)
        }
        og.checks1.forEach(element => {
            if (allChannels.checked == true) {
                element.checked = true                                
            }else{
                element.checked = false
            }
        })
    })

    //filter by channel
    og.checks1.forEach(element => {
        element.addEventListener("click", async() => {
            allChannels.checked = false
            if (element.checked == true) {
                og.checkedElements.push(element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }else{
                og.checkedElements = og.checkedElements.filter(c => c != element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }
            if (og.checkedElements.length == og.checks1.length) {
                allChannels.checked = true
            }else{
                allChannels.checked = false
            }
        })
    })

    //close popups event listener
    og.closePopups.forEach(element => {        
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })

    //table info events listeners
    og.tableIcons.forEach(element => {

        const info = document.getElementById(element.id.replace('Icon','Info'))

        element.addEventListener("mouseover", async(e) => {
            const mouseX = e.clientX
            info.style.left = (mouseX - 100) + 'px'
            info.style.display = 'block'
        })

        element.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    
    })

    //change amount paid
    rpppPayment.addEventListener("change", async() => {
        
        const payment = rpppPayment.value
        og.orderToPayNewBalance = og.orderToPayPayments.balance - payment

        if (rpppPayment.value != '' && rpppPayment.value != '') {
            clearInputs([rpppPayment])
            rpppPayment.value = payment
        }
        
        if ((og.orderToPayPayments.balance - rpppPayment.value) < 0) {
            rpppBalanceAlert.style.color = 'green'
            rpppBalanceAlert.innerHTML = rpppPayment.value == '' ? '' : '<i class="fa-solid fa-triangle-exclamation"></i><div>Quedará un saldo a favor de ARS ' + og.formatter.format(og.orderToPayPayments.balance - rpppPayment.value) + '</div>'
        }

        if ((og.orderToPayPayments.balance - rpppPayment.value) > 0) {
            rpppBalanceAlert.style.color = 'rgb(206, 10, 10)'
            rpppBalanceAlert.innerHTML = rpppPayment.value == '' ? '' : '<i class="fa-solid fa-triangle-exclamation"></i><div>Quedará un saldo pendiente de ARS ' + og.formatter.format(og.orderToPayPayments.balance - rpppPayment.value) + '</div>'
        }

        rpppNewBalance.value = og.formatter.format(og.orderToPayPayments.balance - rpppPayment.value)
    })

    //change payment method
    rpppPaymentMethod.addEventListener("change", async() => {
        const paymentMethod = rpppPaymentMethod.value

        if (rpppPaymentMethod.value != 'default') {
            clearInputs([rpppPaymentMethod])
            rpppPaymentMethod.value = paymentMethod
        }
    })

    //accept register payment
    rpppAccept.addEventListener("click", async() => {
        const errors = inputsValidation(og.rpppValidate)

        if (errors == 0) {
            const data = {
                order:og.orderToPay,
                idCustomer:og.orderToPay.id_customers,
                amount:parseFloat(rpppPayment.value,2),
                idPaymentMethod:rpppPaymentMethod.value,
                newBalance:og.orderToPayNewBalance,
                balance:og.orderToPayPayments.balance
            }
    
            await fetch(dominio + 'apis/sales/register-payment',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            rppp.style.display = 'none'
    
            og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
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

        og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
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

        og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
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

        og.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(coppOk)

    })
})
