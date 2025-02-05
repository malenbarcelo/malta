
import og from "./globals.js"
import { dominio } from "../../dominio.js"
import { clearInputs, dateToString } from "../../generalFunctions.js"
import { printCustomerOrder } from "./printTables.js"

// confirm popup (copp)
function coppEventListeners() {

    coppAccept.addEventListener("click", async() => {
        
        if (og.coppAction == 'destroyMovement') {
            console.log(og.elementToUpdate)
            

        }
    })
}

export {coppEventListeners}