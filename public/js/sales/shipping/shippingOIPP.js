import { dominio } from "../../dominio.js"
import { inputsValidation, isValid, isInvalid } from "../../generalFunctions.js"
import g from "./globals.js"

//ONE INPUT POPUP (OIPP)
async function oippEventListeners() {

    //create
    oippAccept.addEventListener("click", async() => {

        let  errors = inputsValidation([oippInput])

        if (errors == 0) {
            const findMethod = g.shippingMethods.filter(sm => (sm.shipping_method).toLowerCase() == oippInput.value.toLowerCase())
            if (findMethod.length > 0) {
                errors += 1
                isInvalid([oippInput])
                oippInputError.style.display = 'none'
                oippInputError2.innerText = 'La forma de envío ingresada ya existe'
                oippInputError2.style.display = 'block'
            }else{
                isValid([oippInput])
                oippInputError2.style.display = 'none'
            }
        }
        
        if (errors == 0) {
            
            const data = { 
                shipping_method:oippInput.value,
                enabled:1
            }
    
            await fetch(dominio + 'apis/sales/shipping-methods/create',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get date
            g.shippingMethods = await (await fetch(dominio + 'apis/data/shipping-methods')).json()
            
            //complete select
            const id = g.shippingMethods.filter( sm => sm.shipping_method == oippInput.value)[0].id
            eshppMethod.innerHTML += '<option value="' + id + '" selected>' + oippInput.value + '</option>'
            oipp.style.display = 'none'
            
        }
    })
}

export {oippEventListeners}