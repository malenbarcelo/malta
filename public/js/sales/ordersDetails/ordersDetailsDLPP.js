import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData } from "./functions.js"
import { showOkPopup } from "../../generalFunctions.js"

//DELETE LINE POPUP (DLPP)
function dlppEventListeners() {

    dlppAccept.addEventListener("click", async() => {

        const data = {
            lineToDelete:odg.lineToDelete
        }

        await fetch(dominio + 'apis/sales/cancel-order-detail',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dlpp.style.display = 'none'

        bodyOrdersDetails.innerHTML = ''
        ordersDetailsLoader.style.display = 'block'
        await getData()

        okppText.innerText = 'Linea eliminada con éxito'
        showOkPopup(okpp)

    })
}

export {dlppEventListeners}