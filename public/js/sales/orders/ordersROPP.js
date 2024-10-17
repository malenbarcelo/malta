import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"

//RESTORE ORDER POPUP (ROPP)
function roppEventListeners() {

    roppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToRestore}

        await fetch(dominio + 'apis/sales/restore-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ropp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()

        showOkPopup(roppOk)

    })

}

export {roppEventListeners}