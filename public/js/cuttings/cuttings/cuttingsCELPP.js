import { validations, isInvalid, isValid,clearInputs, showOkPopup } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"

// create edit layers popup (celpp)
async function celppEventListeners() {

    // close with X
    celppClose.addEventListener("click", () => {
        schpp.style.display = 'block'
    })

    // close with escape
    document.addEventListener('keydown', function(e) {
        const popup = document.getElementById('celpp')
        if (e.key === 'Escape' && popup.style.display == 'block') {
            const activePopups = g.popups.filter(p => p.style.display == 'block')
            if (activePopups.length == 1) {
                g.escNumber += 1
                if (g.escNumber == 1) {
                    schpp.style.display = 'block'                    
                }else{
                    schpp.style.display = 'none'
                    popup.style.display = 'none'
                    g.escNumber = 0
                }
            }
        }
    })

    // save changes
    celppSave.addEventListener("click", async() => {

        let errors = 0

        if (celppMU.value == '') {
            isInvalid([celppMU])
            errors += 1
        }else{

            let responseData1 = ''
            let responseData2 = ''
            

            // complete MU
            g.selectedCuttingsToEdit.map( sc => sc.fabric_mu = celppMU.value)

            // complete layers_id
            const maxId = await (await fetch(`${dominio}apis/composed/max-id-layers`)).json()
            const layersId = maxId == null ? 1 : maxId + 1 
            g.selectedCuttingsToEdit.map( sc => sc.id_layers = layersId)
            g.layersToCreate.map( l => l.id_layers = layersId)

            console.log(g.layersToCreate)

            // const response1 = await fetch(dominio + 'apis/update/cuttings',{
            //     method:'POST',
            //     headers: {'Content-Type': 'application/json'},
            //     body: JSON.stringify(g.selectedCuttingsToEdit)
            // })

            // responseData1 = await response1.json()

            // if (responseData1.message == 'ok') {
            //     const response2 = await fetch(dominio + 'apis/create/cuttings-layers',{
            //         method:'POST',
            //         headers: {'Content-Type': 'application/json'},
            //         body: JSON.stringify(g.layersToCreate)
            //     })

            //     responseData2 = await response2.json()

            // }
            
        }
    })

    

    
}

export { celppEventListeners }