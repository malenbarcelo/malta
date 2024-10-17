import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData, completeELCPPcolors, completeELSPPsizes } from "./functions.js"
import { showOkPopup, inputsValidation } from "../../generalFunctions.js"

//EDIT LINE POPUP (ELPP)
function elppEventListeners() {

    //change colors
    elppColorsIcon.addEventListener("click", async() => {
        completeELCPPcolors()
        elcppError.style.display = 'none'
        elcpp.style.display = 'block'
    })

    //change sizes
    elppSizesIcon.addEventListener("click", async() => {
        completeELSPPsizes()
        elsppError.style.display = 'none'
        elspp.style.display = 'block'
    })

    //elpp accept    
    elppAccept.addEventListener("click", async() => {

        const errors = inputsValidation([elppPrice])

        if (errors == 0) {
            const data = {
                lineToEdit:odg.lineToEdit,
                unit_price:elppPrice.value,
                required_quantity:elppQtyR.value,
                confirmed_quantity:elppQtyC.value,
                colors:odg.selectedColors,
                sizes:odg.selectedSizes
            }

            console.log(data)
            
            await fetch(dominio + 'apis/sales/edit-order-detail',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            
    
            elpp.style.display = 'none'

            bodyOrdersDetails.innerHTML = ''
            ordersDetailsLoader.style.display = 'block'
            await getData()

            showOkPopup(elppOk)
            
        }
    })
}

export {elppEventListeners}