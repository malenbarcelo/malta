import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { inputsValidation, isInvalid, showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"


//CREATE CUSTOMER (CCPP)
async function ccppEventListeners() {
    
    //create
    ccppCreate.addEventListener("click", async() => {

        let  errors = inputsValidation([ccppCustomer])

        if (errors == 0) {
            const findCustomer = cg.customers.filter(c => (c.customer_name).toLowerCase() == ccppCustomer.value.toLowerCase())
            if (findCustomer.length > 0) {
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
    
            await fetch(dominio + 'apis/sales/customers/create-customer',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get and print data
            ccpp.style.display = 'none'
            customersLoader.style.display = 'block'
            await getData()
            okppText.innerText = 'Cliente creado con éxito'
            showOkPopup(okpp)
        }

    })

    //edit
    ccppEdit.addEventListener("click", async() => {

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
            okppText.innerText = 'Cliente editado con éxito'
            showOkPopup(okpp)
        }

    })
     
}

export {ccppEventListeners}