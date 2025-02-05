import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { clearInputs, dateToString } from "../../generalFunctions.js"
import { updateOrdersData, updateOrderData, getData, applyFilters } from "./functions.js"
import { printOrderDetails } from "./printOrderDetails.js"

async function printOrders() {

    ordersLoader.style.display = 'block'
    bodyOrders.innerHTML = ''

    //printTable
    const rows = og.ordersFiltered.map((element, index) => {
        
    const date = dateToString(element.date);
    const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
    const color = element.enabled === 0 ? 'errorColor' : '';
    const status = element.enabled === 0 ? 'Cancelado' : element.orders_orders_status.order_status;
    
    const paymentClass = 'allowedIcon';
    const paymentVStatus = (element.enabled === 1 && element.id_orders_status !== 1 && element.id_payments_status !== 5) ? '' : 'disabled';
    const paymentVchequed = element.id_payments_status === 6 ? 'checked' : '';

    // const deliverClass = (element.enabled === 1 && element.id_orders_status === 2) ? 'allowedIcon' : 'notAllowedIcon';
    const cancelClass = ((element.id_orders_status === 1 || element.id_orders_status === 2) && [1, 2, 3].includes(element.id_payments_status)) ? 'allowedIcon' : 'notAllowedIcon';
    const cancelIcon = element.enabled === 1 ? 'fa-circle-xmark' : 'fa-circle-check';
    const cancelId = element.enabled === 1 ? 'cancel_' : 'restore_';
    const commentIcon = element.observations ? 'fa-comment-dots' : 'fa-comment';
    
        return `
            <tr id="tr_${element.id}">
            <th class="${rowClass} ${color}">${element.order_number}</th>
                <th class="${rowClass} ${color}">${element.season}</th>
                <th class="${rowClass} ${color}">${date}</th>
                <th class="${rowClass} ${color}">${element.orders_sales_channels.sales_channel}</th>
                <th class="${rowClass} ${color}">${element.orders_customers.customer_name}</th>
                <th class="${rowClass} ${color}">${og.formatter.format(element.subtotal)}</th>
                <th class="${rowClass} ${color}">${Math.round(element.discount * 100)}%</th>
                <th class="${rowClass} ${color}">${og.formatter.format(element.total)}</th>
                <th class="${rowClass} ${color}">${og.formatter.format(element.amountPaid)}</th>
                <th class="${rowClass} ${color}">${og.formatter.format(element.balance)}</th>
                <th class="${rowClass} ${(element.id_orders_status === 1 ? 'errorColor' : color)}">${status}</th>
                <th class="${rowClass} ${color}">${element.orders_payments_status.payment_status}</th>
                <th class="${rowClass} ${color}">${element.orders_orders_managers.order_manager_name}</th>
                <th class="${rowClass} ${color}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                <th class="${rowClass} ${color}"><i class="fa-regular fa-credit-card ${paymentClass}" id="${paymentClass === 'allowedIcon' ? 'payment_' + element.id : ''}"></i></th>
                <th class="${rowClass} ${color}"><input type="checkbox" id="paymentV_${element.id}" ${paymentVchequed} ${paymentVStatus}></th>
                <th class="${rowClass} ${color}"><i class="fa-solid fa-user-pen allowedIcon" id="assign_${element.id}"></i></th>
                <th class="${rowClass} ${color}"><i class="fa-regular ${commentIcon} allowedIcon" id="obs_${element.id}"></i></th>
                <th class="${rowClass} ${color}"><i class="fa-regular ${cancelIcon} ${cancelClass}" id="${cancelClass === 'allowedIcon' ? cancelId + element.id : ''}"></i></th>
            </tr>
        `
    })

    bodyOrders.innerHTML = rows.join('')

    updateOrdersData()
    ordersEventListeners()

    ordersLoader.style.display = 'none'
}

function ordersEventListeners() {

    og.ordersFiltered.forEach(element => {

        const customer = element.orders_customers.customer_name
        const cancelOrder = document.getElementById('cancel_' + element.id)
        const edit = document.getElementById('edit_' + element.id)
        const assignOrder = document.getElementById('assign_' + element.id)
        const obs = document.getElementById('obs_' + element.id)
        //const deliverOrder = document.getElementById('deliver_' + element.id)
        const restoreOrder = document.getElementById('restore_' + element.id)
        const payment = document.getElementById('payment_' + element.id)
        const paymentV = document.getElementById('paymentV_' + element.id) 
        const tr = document.getElementById('tr_' + element.id)       

        //cancel order
        if (cancelOrder) {
            cancelOrder.addEventListener('click',async()=>{
                og.idOrderToCancel = element.id
                caoppQuestion.innerHTML = '¿Confirma que desea cancelar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
                caopp.style.display = 'block'
            })
        }

        //edit
        edit.addEventListener("click", async() => {

            //clear data
            og.orderDetails = [...element.orders_orders_details]
            printOrderDetails()
            clearInputs([selectProduct, ceoppReqQty, ceoppConfQty])
            ceoppAddError.style.display = 'none'
            ceoppAttributes.style.display = 'none'
                
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
            og.orderData.id = element.id
            ceoppTitle.innerText = 'EDITAR PEDIDO'
            og.action = 'edit'
            ceoppEdit.style.display = 'flex'
            ceoppCreate.style.display = 'none'
    
            updateOrderData()

            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        })

        //edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        //payment
        if (payment) {
            payment.addEventListener('click',async()=>{

                rpppUnabledAccept.style.display = 'none'
                rpppAccept.style.display = 'block'

                //find customer positive balance and show checkbox if applies
                let positiveBalance = await (await fetch(dominio + 'apis/sales/payments-assignations/customer-assignations/' + element.id_customers)).json()

                if (positiveBalance > 0) {
                    og.orderToPayCustomerBalance = positiveBalance
                    rpppUseBalanceLabel.innerText = 'Usar saldo a favor (ARS ' + og.formatter.format(positiveBalance) + ')'
                    rpppUseBalance.classList.remove('notVisible')
                    rpppNegativeBalance.classList.add('notVisible')

                }else if(positiveBalance < 0){
                    og.orderToPayCustomerBalance = positiveBalance
                    rpppNegativeBalance.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i> El cliente tiene en saldo en contra de $ ' + og.formatter.format(positiveBalance)
                    rpppUseBalance.classList.add('notVisible')
                    rpppNegativeBalance.classList.remove('notVisible')
                }else{
                    rpppUseBalance.classList.add('notVisible')
                    rpppNegativeBalance.classList.add('notVisible')
                    og.orderToPayCustomerBalance = 0
                }

                //complete elements and globals data
                og.orderToPay = element
                og.orderToPayPayment.balanceUsed = 0
                rpppSubtotal.value = og.formatter.format(element.subtotal)
                rpppDiscount.value = og.formatter.format(element.discount * 100) + '%'
                rpppTotal.value = og.formatter.format(element.total)
                rpppPaid.value = og.formatter.format(element.amountPaid)
                rpppBalance.value = og.formatter.format(element.balance)
                rpppBalanceUsed.value = og.formatter.format(0)
                rpppNewBalance.value = og.formatter.format(element.balance)
                rpppBalanceAlert.innerHTML = ''
                rpppUseBalanceCheck.checked = false
                rpppTitle.innerText = 'PEDIDO #' + element.order_number
                clearInputs([rpppDate,rpppPayment,rpppPaymentMethod])
                const today = new Date()
                const year = today.getFullYear()
                const month = String(today.getMonth() + 1).padStart(2, '0')
                const day = String(today.getDate()).padStart(2, '0')
                const formattedDate = `${year}-${month}-${day}`
                rpppDate.value = formattedDate

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

                bodyOrders.innerHTML = ''
                ordersLoader.style.display = 'block'
                await getData()
                applyFilters()
                printOrders()

            })  

        }

        //deliver order
        // if (deliverOrder) {
        //     deliverOrder.addEventListener('click',async()=>{
        //         og.idOrderToDeliver = element.id
        //         doppQuestion.innerHTML = '¿Confirma que desea entregar el pedido <b>N° ' + element.order_number + '</b> del cliente <b>' + customer + '</b>?'
        //         dopp.style.display = 'block'
        //     })
        // }

        //assign manager
        if (assignOrder) {
            assignOrder.addEventListener('click',async()=>{
                amppSelectOM.value = element.id_orders_managers
                og.idOrderToAssign = element.id
                ampp.style.display = 'block'
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


export { printOrders }