import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { applyFilters, getData } from "./functions.js"
import { showOkPopup} from "../../generalFunctions.js"
import { printOrders } from "./printOrders.js"

//CANCEL ORDER POPUP (CAOPP)
function caoppEventListeners() {
    //accept cancel order
    caoppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToCancel}

        await fetch(dominio + 'apis/sales/cancel-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        caopp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()
        applyFilters()
        printOrders()

        okppText.innerText = 'Orden cancelada con éxito'
        showOkPopup(okpp)

    })
}

export {caoppEventListeners}