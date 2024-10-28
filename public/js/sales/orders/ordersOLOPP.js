import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { updateOrderData} from "./functions.js"
import { printOrderDetails} from "./printOrderDetails.js"

//ORDERS LINE OBSERVATIONS (OLOPP)
function oloppEventListeners() {

    oloppAccept.addEventListener("click", async() => {

        const id = og.idOrderDetailsToEdit

        og.orderDetails = og.orderDetails.map(element => {
            if (element.id == id) {
              return {...element, observations2: oloppObs.value}
            }
            return element
        })

        updateOrderData()
        printOrderDetails()

        olopp.style.display = 'none'
    })

}

export {oloppEventListeners}