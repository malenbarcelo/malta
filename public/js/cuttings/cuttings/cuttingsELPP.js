import { validations, showOkPopup } from "../../generalFunctions.js"
import g from "./globals.js"
import { printLayers } from "./printLayers.js"
import { f } from "./functions.js"

// edit line popup (elpp)
async function elppEventListeners() {

    // save data    
    elppSave.addEventListener("click", async() => {

        let errors = validation()

        if (errors == 0) {

            let elementToEdit = {}

            detailsBody.innerHTML = ''
            layersLoader.style.display = 'block'
            elpp.style.display = 'none'

            if (g.action == 'create') {
                elementToEdit = g.layersToCreate.find(l => l.position == g.positionToEdit);
            }else{
                elementToEdit = g.layersToEdit.find(l => l.position == g.positionToEdit);
            }
            
            elementToEdit.color = elppColor.value
            elementToEdit.layers = parseInt(elppLayers.value)
            elementToEdit.kgs_mts = elppKgsMts.value == '' ? 0 : parseFloat(elppKgsMts.value,2)

            // update cuttings data
            // g.selectedCuttingsToEdit.forEach(element => {
            //     const percentage = (element.base == null || element.base == 0 || g.totalBase == 0) ? 0 : ((parseFloat(element.base,2) / parseFloat(g.totalBase,2)) * 100)
            //     element.kgs_mts = parseFloat(percentage * g.totalKgsMts,2)
            // })
            
            f.updateTotalsData()
            f.printLayersSummary()
            f.updateLayersSummary()
            printLayers()
            f.printCuttingOrders()

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