import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation } from "../../generalFunctions.js"
import { updateOrderData, completeEPCPPcolors, completeEPSPPsizes } from "./functions.js"
import { printOrderDetails } from "./printOrderDetails.js"

//EDIT ORDER DETAILS POPUP (EODPP)
function eodppEventListeners() {

    //change colors
    eodppColorsIcon.addEventListener("click", async() => {
        completeEPCPPcolors()
        epcppError.style.display = 'none'
        epcpp.style.display = 'block'
    })

    //change sizes
    eodppSizesIcon.addEventListener("click", async() => {
        completeEPSPPsizes()
        epsppError.style.display = 'none'
        epspp.style.display = 'block'
    })
    
    //accept changes
    eodppAccept.addEventListener("click", async() => {
        const errors = inputsValidation([eodppPrice])
        
        if (errors == 0) {

            const unitPrice = eodppPrice.value
            const quantityR = eodppQtyR.value
            const quantityC = eodppQtyC.value
            const extendedPrice = unitPrice * quantityC            
            const id = og.idOrderDetailsToEdit

            og.orderDetails = og.orderDetails.map(element => {
                if (element.id == id) {
                  return {...element, unit_price: unitPrice, required_quantity: quantityR, confirmed_quantity: quantityC, extended_price: extendedPrice, colors: og.selectedColors, sizes: og.selectedSizes}
                }
                return element
            })

            updateOrderData()
            printOrderDetails()

            //close popup
           eodpp.style.display = 'none'
        }
    })
    
}

export {eodppEventListeners}