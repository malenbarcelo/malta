import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { applyFilters, getData } from "./functions.js"
import { printOrders } from "./printOrders.js"

//ASSIGN MANAGER POPUP (AMPP)
function amppEventListeners() {

    //accept assign order manager
    amppAccept.addEventListener("click", async() => {

        const data = {
            idOrder:og.idOrderToAssign,
            orderManagerId:amppSelectOM.value
        }

        await fetch(dominio + 'apis/sales/assign-order-manager',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ampp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()
        applyFilters()
        printOrders()

        okppText.innerText = 'Encargado editado con éxito'
        showOkPopup(okpp)

    })

}

export {amppEventListeners}