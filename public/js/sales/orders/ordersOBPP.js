import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, clearInputs, showOkPopup } from "../../generalFunctions.js"
import { updateData } from "./functions.js"

//OBSERVATIONS POPUP (OBPP)
function obppEventListeners() {

    //save observations
    obppAccept.addEventListener("click", async() => {
        if (og.notesFrom == 'orders') {
            const data = {
                id: og.idOrderObservations,
                observations: obppObs.value
            }
    
            await fetch(dominio + 'apis/sales/edit-order-observations',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }else{
            const data = {
                id: og.customerData[0].id,
                notes: obppObs.value
            }
    
            await fetch(dominio + 'apis/sales/customers/post-notes',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

        }

        updateData()
        
        obpp.style.display = 'none'

        showOkPopup(obppOk)

    })
}

export {obppEventListeners}