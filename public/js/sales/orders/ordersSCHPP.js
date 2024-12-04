import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup, closeWithEscape } from "../../generalFunctions.js"
import { applyFilters, getData } from "./functions.js"
import { printOrders } from "./printOrders.js"

//SAVE CHANGES POPUP (SCHPP)
function schppEventListeners() {

    schppClose.addEventListener("click", () => {
        schpp.style.display = 'none'
    })
    
    schppCancel.addEventListener("click", () => {
        ceopp.classList.remove('slideIn')
        schpp.style.display = 'none'
    })

    schppAccept.addEventListener("click", () => {
        schpp.style.display = 'none'
        if (og.action === 'create') {
            ceoppCreate.click();
        } else {
            ceoppEdit.click();
        }
    })

    

}

export {schppEventListeners}