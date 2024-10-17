import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { isInvalid, clearInputs, showOkPopup } from "../../generalFunctions.js"
import { getData, updateCustomerData } from "./functions.js"

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
                console.log(og.orderToPay.balance)
                console.log(totalPayment)
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

        

        if (errors == 0) {

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
            

            showOkPopup(rpppOk)

        }
        
    })
        
}

export {rpppEventListeners}