import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { getData, updateCustomerData } from "./functions.js"

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
        updateCustomerData()

        showOkPopup(obppOk)

    })
}

export {obppEventListeners}