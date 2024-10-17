import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, showOkPopup, acceptWithEnter,isValid } from "../../generalFunctions.js"
import { updateCustomerData, getData } from "./functions.js"

//REGISTER CUSTOMER PAYMENT POPUP (RCPPP)
function rcpppEventListeners() {

    rcpppType.addEventListener("change", async() => {
        if (rcpppType.value != '') {
            isValid([rcpppType])           
        }
    })

    rcpppPaymentMethod.addEventListener("change", async() => {
        if (rcpppPaymentMethod.value != '') {
            isValid([rcpppPaymentMethod])           
        }
    })

    rcpppAmount.addEventListener("change", async() => {
        if (rcpppAmount.value != '') {
            isValid([rcpppAmount])           
        }
    })

    rcpppAccept.addEventListener("click", async() => {

        //validations
        const errors = inputsValidation([rcpppType,rcpppPaymentMethod,rcpppAmount])

        if (errors == 0) {

            const data = {
                amount:parseFloat(rcpppAmount.value,2),
                type:rcpppType.value,
                id_customers:og.customerData[0].id,
                id_payments_methods: rcpppPaymentMethod.value
            }

            //register customer payment
            if (data.amount > 0) {
                await fetch(dominio + 'apis/sales/payments/register-customer-payment',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
            }

            updateCustomerData()
            rcppp.style.display = 'none'
            bodyOrders.innerHTML = ''
            ordersLoader.style.display = 'block'
            await getData()
            showOkPopup(rcpppOk)
        }
    })

    acceptWithEnter(rcpppAmount,rcpppAccept)
        
}

export {rcpppEventListeners}