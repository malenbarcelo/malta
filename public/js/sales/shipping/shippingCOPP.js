import { dominio } from "../../dominio.js"
import { showOkPopup } from "../../generalFunctions.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"
import { applyFilters, getData } from "./functions.js"

//CONFIRM POPUP (COPP)
async function coppEventListeners() {

    //accept
    coppAccept.addEventListener("click", async() => {
            
        const data = {
            idOrder: g.idOrderToDeliver,
        }

        await fetch(dominio + 'apis/sales/deliver-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get and print data
        loader.style.display = 'block'
        copp.style.display = 'none'
        await getData()
        applyFilters()
        printTable()
        okppText.innerText = 'Pedido entregado con éxito'
        showOkPopup(okpp)
    })
}

export {coppEventListeners}