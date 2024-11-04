import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { inputsValidation, isInvalid, showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"

//CREATE PAYMENT METHOD POPUP (CPMPP)
async function cpmppEventListeners() {
    
    //create
    cpmppCreate.addEventListener("click", async() => {

        let  errors = inputsValidation([cpmppPaymentMethod])

        if (errors == 0) {
            const findPM = cg.paymentMethods.filter(pm => (pm.payment_method).toLowerCase() == cpmppPaymentMethod.value.toLowerCase())
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

            //get and print data
            cpmpp.style.display = 'none'
            paymentMethodsLoader.style.display = 'block'
            await getData()
            okppText.innerText = 'Forma de pago creada con éxito'
            showOkPopup(okpp)
        }

    })

    //edit
    cpmppEdit.addEventListener("click", async() => {

        let  errors = inputsValidation([ccppCustomer])

        if (errors == 0) {
            const findCustomer = cg.customers.filter(c => (c.customer_name).toLowerCase() == ccppCustomer.value.toLowerCase())
            if (findCustomer.length > 0 && cg.customerToEdit != ccppCustomer.value) {
                errors += 1
                isInvalid([ccppCustomer])
                ccppCustomerError.style.display = 'none'
                ccppCustomerError2.style.display = 'block'
            }else{
                ccppCustomerError2.style.display = 'none'
            }
        }
        
        if (errors == 0) {
            
            const data = {
                id:cg.idCustomer,
                newData:{
                    customer_name:ccppCustomer.value,
                    email:ccppEmail.value,
                    address:ccppAddress.value,
                    city:ccppCity.value,
                    country:ccppCountry.value,
                    mobile:ccppMobile.value == '' ? 0 : parseInt(ccppMobile.value),
                    discount:ccppDiscount.value == '' ? 0 : parseFloat(ccppDiscount.value,2)/100,
                    notes:ccppNotes.value,
                    enabled:1
                }
            }
    
            await fetch(dominio + 'apis/sales/customers/edit-customer',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get and print data
            ccpp.style.display = 'none'
            customersLoader.style.display = 'block'
            await getData()
            okppText.innerText = 'Forma de pago editada con éxito'
            showOkPopup(okpp)
        }

    })
     
}

export {cpmppEventListeners}