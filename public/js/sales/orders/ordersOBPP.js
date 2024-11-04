import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { applyFilters, getData, updateCustomerData } from "./functions.js"
import { printOrders } from "./printOrders.js"

//OBSERVATIONS POPUP (OBPP)
function obppEventListeners() {

    //save observations
    obppAccept.addEventListener("click", async() => {
        if (og.notesFrom == 'orders') {
            const data = {
                id: og.idOrderObservations,
                observations: obppObs.value
            }
    
            await fetch(dominio + 'apis/sales/edit-order-observations',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
        }else{
            const data = {
                id: og.customerData[0].id,
                notes: obppObs.value
            }
    
            await fetch(dominio + 'apis/sales/customers/post-notes',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

        }
        
        obpp.style.display = 'none'

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        await getData()
        applyFilters()
        printOrders()
        updateCustomerData()

        okppText.innerText = 'Observaciones editadas con éxito'
        showOkPopup(okpp)

    })
}

export {obppEventListeners}