import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { f } from "./functions.js"
import { printDetails } from "./printDetails.js"

//LINE OBSERVATIONS POPUP (LOPP)
function loppEventListeners() {

    loppAccept.addEventListener("click", async() => {

        lopp.style.display = 'none'
        bodyOrdersDetails.innerHTML = ''
        ordersDetailsLoader.style.display = 'block'

        const data = {
            id: g.lineToEdit.id,
            observations: loppObs.value
        }

        await fetch(dominio + 'apis/sales/edit-order-detail-observations',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        
        
        
        //update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        //get and print data
        g.details = await f.getDetails()
        printDetails()

        ordersDetailsTable.scrollTop = 0

        okText.innerText = 'Observaciones editadas con éxito'
        showOkPopup(okPopup)

        ordersDetailsLoader.style.display = 'none'

    })

}

export {loppEventListeners}