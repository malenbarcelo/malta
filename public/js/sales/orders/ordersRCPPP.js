import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, showOkPopup, isValid, clearInputs } from "../../generalFunctions.js"
import { updateCustomerData, getData, applyFilters } from "./functions.js"
import { printOrders } from "./printOrders.js"

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

    //create payment method
    rcpppNewPaymentMethod.addEventListener("click", async() => {
        clearInputs([cpmppPaymentMethod])
        isValid([cpmppPaymentMethod])
        cpmppEdit.style.display = 'none'
        cpmppCreate.style.display = 'block'
        og.createPaymentMethodFrom = 'customerPayment'
        cpmppTitle.innerText = 'CREAR FORMA DE PAGO'
        cpmpp.style.display = 'block'
    })

    rcpppAccept.addEventListener("click", async() => {

        //validations
        const errors = inputsValidation([rcpppDate,rcpppType,rcpppPaymentMethod,rcpppAmount])

        if (errors == 0) {

            const data = {
                date: rcpppDate.value,
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
            applyFilters()
            printOrders()
            okppText.innerText = 'Pago registrado con éxito'
            showOkPopup(okpp)
        }
    })
        
}

export {rcpppEventListeners}