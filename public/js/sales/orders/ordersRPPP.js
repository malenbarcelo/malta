import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { isInvalid, clearInputs, showOkPopup,isValid, ignoreDoubleClick } from "../../generalFunctions.js"
import { applyFilters, getData, updateCustomerData } from "./functions.js"
import { printOrders } from "./printOrders.js"

//REGISTER PAYMENT POPUP (RPPP)
function rpppEventListeners() {

    const inputs = [rpppPayment,rpppBalanceUsed]

    //change amount paid
    inputs.forEach(input => {

        input.addEventListener("change", async() => {

            const payment = rpppPayment.value == '' ? 0 : parseFloat(rpppPayment.value,2)
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
            }else if (og.orderToPay.balance > totalPayment) {
                rpppBalanceAlert.style.color = 'rgb(206, 10, 10)';
                rpppBalanceAlert.innerHTML = '<i class="fa-solid fa-triangle-exclamation"></i><div>Quedará un saldo pendiente de ARS ' + og.formatter.format(og.orderToPay.balance - totalPayment) + '</div>';
            } else {
                rpppBalanceAlert.innerHTML = ''; 
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

        rpppBalanceUsed.dispatchEvent(new Event('change'))

    })

    //create payment method
    rpppNewPaymentMethod.addEventListener("click", async() => {
        clearInputs([cpmppPaymentMethod])
        isValid([cpmppPaymentMethod])
        og.createPaymentMethodFrom = 'orderPayment'
        cpmppEdit.style.display = 'none'
        cpmppCreate.style.display = 'block'
        cpmppTitle.innerText = 'CREAR FORMA DE PAGO'
        cpmpp.style.display = 'block'
    })

    rpppAccept.addEventListener("click", async() => {

        let responseStatus1
        let responseStatus2

        // ignore double click
        if (ignoreDoubleClick(1200)) {
            return
        }

        //validations
        const errors = validations()

        if (errors == 0) {

            ordersLoader.style.display = 'block'
            rppp.style.display = 'none'

            //get date
            let date = new Date(rpppDate.value)
            date = date.setHours(date.getHours() + 3)

            //get data
            const payment = rpppPayment.value == '' ? 0 : parseFloat(rpppPayment.value)
            const assignation = parseFloat(rpppBalanceUsed.value.replace('.',''),2)
            const newBalance = og.orderToPay.balance - payment - assignation

            //complete data
            const data = []

            if (payment > 0) {
                const assignedPayment = newBalance < 0 ? og.orderToPay.balance - assignation : payment
                data.push({
                    id_orders:og.orderToPay.id,
                    date: date,
                    type: 'PAGO ASIGNADO',
                    amount:assignedPayment,
                    id_payments_methods:rpppPaymentMethod.value,
                    id_customers: og.orderToPay.id_customers
                })
            }

            if (rpppBalanceUsed.value > 0) {
                data.push({
                    id_orders:og.orderToPay.id,
                    date: date,
                    type: 'ASIGNACION',
                    amount:assignation,
                    id_customers: og.orderToPay.id_customers
                })
            }

            if (newBalance < 0) {
                data.push({
                    date: date,
                    type: 'PAGO NO ASIGNADO',
                    amount:-newBalance,
                    id_customers: og.orderToPay.id_customers,
                    id_payments_methods:rpppPaymentMethod.value,
                })
            }

            //register payment
            const response = await fetch(dominio + 'apis/create/sales-transactions',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus1 = await response.json()

            // update payment status
            if (responseStatus1.message == 'ok') {

                const idPaymentsStatus = newBalance > 0 ? 4 : 5

                const data = [{
                    id: og.orderToPay.id,
                    id_payments_status : idPaymentsStatus
                }]

                const response = await fetch(dominio + 'apis/update/sales-orders',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                responseStatus2 = await response.json()
            }

            // update data
            bodyOrders.innerHTML = ''
            await getData()
            applyFilters()
            printOrders()

            // show result
            if (responseStatus1.message == 'ok' && responseStatus2.message == 'ok') {
                okText.innerText = 'Pago registrado con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al registrar el pago'
                showOkPopup(errorPopup)
            }

            // hide loader
            ordersLoader.style.display = 'none'

        }

    })
}

function validations() {

    let errors = 0

    if (rpppDate.value == '') {
        errors += 1
        isInvalid([rpppDate])
    }

    if (rpppBalanceUsed.value == 0 && rpppPayment.value == '') {
        errors += 1
        isInvalid([rpppPayment])
    }

    if (rpppBalanceUsed.value == 0 && rpppPaymentMethod.value == '') {
        errors += 1
        isInvalid([rpppPaymentMethod])
    }

    return errors

}



export {rpppEventListeners}