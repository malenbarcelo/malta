import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, isInvalid, showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"

//CREATE PAYMENT METHOD POPUP (CPMPP)
async function cpmppEventListeners() {
    
    //create
    cpmppCreate.addEventListener("click", async() => {
        
        let  errors = inputsValidation([cpmppPaymentMethod])

        if (errors == 0) {
            const findPM = og.paymentMethods.filter(pm => (pm.payment_method).toLowerCase() == cpmppPaymentMethod.value.toLowerCase())
            if (findPM.length > 0) {
                errors += 1
                isInvalid([cpmppPaymentMethod])
                cpmppPaymentMethodError.style.display = 'none'
                cpmppPaymentMethodError2.style.display = 'block'
            }else{
                cpmppPaymentMethodError2.style.display = 'none'
            }
        }
        
        if (errors == 0) {
            
            const data = {
                payment_method: cpmppPaymentMethod.value,
                enabled:1
            }
    
            await fetch(dominio + 'apis/sales/payment-methods/create-payment-method',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get data
            og.paymentMethods = await (await fetch(dominio + 'apis/data/payment-methods')).json()

            //change select
            if (og.createPaymentMethodFrom == 'orderPayment') {
                rpppPaymentMethod.innerHTML = ''
                og.paymentMethods.forEach(element => {
                    rpppPaymentMethod.innerHTML += '<option value="' + element.id + '" ' + (element.payment_method == data.payment_method ? 'selected' : null) + '>' + element.payment_method + '</option>'
                })
                
            }else{
                og.paymentMethods.forEach(element => {
                    rcpppPaymentMethod.innerHTML += '<option value="' + element.id + '" ' + (element.payment_method == data.payment_method ? 'selected' : null) + '>' + element.payment_method + '</option>'
                })
            }
            
            cpmpp.style.display = 'none'
        }

    })
}

export {cpmppEventListeners}