import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { isInvalid, clearInputs, showOkPopup,isValid } from "../../generalFunctions.js"
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
                rpppBalanceAlert.innerHTML = '';  // Sin alertas si es igual
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

        let errors = 0

        if (rpppBalanceUsed.value == 0 && rpppPayment.value == '') {
            errors += 1
            isInvalid([rpppPayment])
        }

        if (rpppBalanceUsed.value == 0 && rpppPaymentMethod.value == '') {
            errors += 1
            isInvalid([rpppPaymentMethod])
        }

        //find customer positive balance and show checkbox if applies
        let positiveBalance = await (await fetch(dominio + 'apis/sales/payments-assignations/customer-assignations/' + og.orderToPay.id_customers)).json()

        if (positiveBalance == 0 && og.orderToPay.balanceUsed > 0) {
            errors += 1
            ordersLoader.style.display = 'block'
            updateCustomerData()
            bodyOrders.innerHTML = ''
            await getData()
            applyFilters()
            printOrders()
            rppp.style.display = 'none'
            errorppText.innerText = 'El saldo a favor ya fue utilizado'
            showOkPopup(errorpp)

        }

        if (errors == 0) {

            rpppUnabledAccept.style.display = 'block'
            rpppAccept.style.display = 'none'

            const data = {
                orderToPay:og.orderToPay,
                amountPaid:og.orderToPayPayment,
                idPaymentMethod:rpppPaymentMethod.value,
                newBalance:og.orderToPayNewBalance
            }

            //register payment
            if (data.amountPaid.payment > 0 || data.amountPaid.balanceUsed > 0) {
                await fetch(dominio + 'apis/sales/register-payment',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
            }

            updateCustomerData()

            rppp.style.display = 'none'

            bodyOrders.innerHTML = ''
            ordersLoader.style.display = 'block'
            await getData()
            applyFilters()
            printOrders()
            okppText.innerText = 'Pago registrado con éxito'
            showOkPopup(okpp)

        }
        
    })
}

export {rpppEventListeners}