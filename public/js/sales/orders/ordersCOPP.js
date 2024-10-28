import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { getData } from "./functions.js"
import { showOkPopup} from "../../generalFunctions.js"

//CANCEL ORDER POPUP (COPP)
function coppEventListeners() {
    //accept cancel order
    coppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToCancel}

        await fetch(dominio + 'apis/sales/cancel-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        copp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()

        showOkPopup(coppOk)

    })
}

export {coppEventListeners}