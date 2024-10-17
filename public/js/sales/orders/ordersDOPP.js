import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"

//DELIVER ORDER POPUP (DOPP)
function doppEventListeners() {

    //accept deliver order
    doppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToDeliver}

        await fetch(dominio + 'apis/sales/deliver-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dopp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()

        showOkPopup(doppOk)

    })

}

export {doppEventListeners}