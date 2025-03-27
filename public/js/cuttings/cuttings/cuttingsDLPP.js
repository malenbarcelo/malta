
import g from "./globals.js"
import { dominio } from "../../dominio.js"
import { showOkPopup } from "../../generalFunctions.js"
import { f } from "./functions.js"

// delete layers popup (dlpp)
async function dlppEventListeners() {

    dlppYes.addEventListener("click", async() => {

        loader.style.display = 'block'
        dlpp.style.display = 'none'
        celpp.style.display = 'none'

        let responseData1 = ''
        let responseData2 = ''        

        const data = {
            idLayers: g.selectedCuttingsToEdit[0].id_layers
        }

        g.selectedCuttingsToEdit.forEach(c => {
            c.id_layers = null
            c.base = null
            c.kgs_mts = null
            c.fabric_mu = null
        })

        // delete layers
        const response1 = await fetch(dominio + 'apis/delete/cuttings-layers',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        responseData1 = await response1.json()

        if (responseData1.message == 'ok' ) {
            // update cuttings
            const response2 = await fetch(dominio + 'apis/update/cuttings',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(g.selectedCuttingsToEdit)
            })

            responseData2 = await response2.json()

            if (responseData2.message == 'ok') {
                okText.innerText = 'Orden de corte eliminada con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al eliminar la orden de corte'
                showOkPopup(errorPopup)
            }

            await f.restoreData()

            loader.style.display = 'none'


        }

        

        
        
    })
}

export { dlppEventListeners }