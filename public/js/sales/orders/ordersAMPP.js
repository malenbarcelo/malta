import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { acceptWithEnter, showOkPopup } from "../../generalFunctions.js"
import { getData } from "./functions.js"

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

        showOkPopup(amppOk)

    })

    //change discount with enter
    acceptWithEnter(amppSelectOM,amppAccept)

}

export {amppEventListeners}