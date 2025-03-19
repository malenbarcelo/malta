import { validations, showOkPopup } from "../../generalFunctions.js"
import g from "./globals.js"
import { printLayers, printLayersSummary } from "./printLayers.js"

// edit line popup (elpp)
async function elppEventListeners() {

    // save data    
    elppSave.addEventListener("click", async() => {

        let errors = validation()

        if (errors == 0) {

            detailsBody.innerHTML = ''
            layersLoader.style.display = 'block'
            elpp.style.display = 'none'
            const elementToEdit = g.layersToCreate.find(l => l.position == g.positionToEdit);
            elementToEdit.color = elppColor.value
            elementToEdit.layers = parseInt(elppLayers.value)
            elementToEdit.kgs_mts = elppKgsMts.value == '' ? 0 : parseFloat(elppKgsMts.value,2)
            g.totalLayers = g.layersToCreate.reduce((total, l) => total + ((l.layers == null || l.layers == '') ? 0 : parseInt(l.layers)), 0)
            g.totalKgsMts = g.layersToCreate.reduce((total, l) => total + ((l.kgs_mts == null || l.kgs_mts == '') ? 0 : parseFloat(l.kgs_mts,2)), 0)

            printLayers()
            printLayersSummary()
            layersLoader.style.display = 'none'            
        }
    })
}

function validation(){

    let errors = 0

    // elppColor
    errors += validations(elppColor,[{'validation':'isEmpty','text': 'Debe completar el campo'}])
    
    // elppLayers
    errors += validations(elppLayers,[{'validation':'isEmpty','text': 'Debe completar el campo'}])

    return errors
    
}

export { elppEventListeners }