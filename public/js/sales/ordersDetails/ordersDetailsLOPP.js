import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData } from "./functions.js"
import { showOkPopup } from "../../generalFunctions.js"

//LINE OBSERVATIONS POPUP (LOPP)
function loppEventListeners() {

    loppAccept.addEventListener("click", async() => {

        const data = {
            id: odg.lineToEdit.id,
            observations: loppObs.value
        }

        await fetch(dominio + 'apis/sales/edit-order-detail-observations',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        lopp.style.display = 'none'

        bodyOrdersDetails.innerHTML = ''
        ordersDetailsLoader.style.display = 'block'
        await getData()

        showOkPopup(loppOk)

    })

}

export {loppEventListeners}