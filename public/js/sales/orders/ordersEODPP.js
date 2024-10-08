import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, clearInputs, showOkPopup,acceptWithEnter,selectFocusedElement,predictElements} from "../../generalFunctions.js"
import { filterOrders,printTableOrders, changeSizesOptions,printColorsOptions,updateOrderData,printTableCreateEdit } from "./ordersFunctions.js"
import { updateData } from "./functions.js"

//EDIT ORDER DETAILS POPUP (EODPP)
function eodppEventListeners() {
    
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
                  return {...element, unit_price: unitPrice, required_quantity: quantityR, confirmed_quantity: quantityC, extended_price: extendedPrice}
                }
                return element
            })

            updateOrderData()
            printTableCreateEdit()

            //close popup
           eodpp.style.display = 'none'
        }
    })
    
}

export {eodppEventListeners}