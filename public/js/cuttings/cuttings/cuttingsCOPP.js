import { validations, isInvalid, isValid,clearInputs, showOkPopup } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { printLayersDetails, printLayersSummary, printTable, updateSummary } from "./printTable.js"

// create edit layers popup (celpp)
async function celppEventListeners() {

    celppUnitsPerLayer.addEventListener("change", async() => {
        celppGarments.innerText = (celppUnitsPerLayer.value == '' || celppUnitsPerLayer.value == 0) ? '?' : (parseFloat(celppLayers.innerText,2) / parseFloat(celppUnitsPerLayer.value,2)).toFixed(2)
        printLayersSummary()
    })

    celppAdd.addEventListener("click", async() => {
        if (celppColorToAdd.value == '' || celppLayersToAdd.value == '' || celppKgsMtsToAdd.value == '') {
            isInvalid(g.celppInputs)
            celppError.style.display = 'block'
        }else{
            
            layersLoader.style.display = 'block'        
            detailsBody.innerHTML = ''

            // add details to array
            const maxId = g.layersDetails.length == 0 ? 0 : Math.max(...g.layersDetails.map(obj => obj.id))
            g.layersDetails.push({
                id: maxId + 1 || 1,
                id_cuttings: g.cuttingToEdit.id,
                color: celppColorToAdd.value,
                layers: parseInt(celppLayersToAdd.value),
                kgs_mts:celppKgsMtsToAdd.value,
                type:'create'
            })
            g.layersDetails.sort((a, b) => {
                if (a.color.toLowerCase() < b.color.toLowerCase()) return -1;
                if (a.color.toLowerCase() > b.color.toLowerCase()) return 1;
                return 0;
            })

            // add data to summary
            let counter = 0
            g.layersSummary.forEach(item => {
                if (item.color.toLowerCase() == celppColorToAdd.value.toLowerCase()) {
                  counter += 1
                  item.total_layers = parseFloat(item.total_layers,2) + parseFloat(celppLayersToAdd.value,2)
                  item.total_kgs_mts = parseFloat(item.total_kgs_mts,2) + parseFloat(celppKgsMtsToAdd.value,2)
                }
            })

            if (counter == 0) {
                g.layersSummary.push({
                    id_cuttings: g.cuttingToEdit.id,
                    color: celppColorToAdd.value,
                    total_kgs_mts: parseFloat(celppKgsMtsToAdd.value,2),
                    total_layers: parseFloat(celppLayersToAdd.value,2)
                })
            }

            g.layersSummary.sort((a, b) => {
                if (a.color.toLowerCase() < b.color.toLowerCase()) return -1;
                if (a.color.toLowerCase() > b.color.toLowerCase()) return 1;
                return 0;
            })  

            // clear inputs
            isValid(g.celppInputs)
            clearInputs([celppLayersToAdd,celppKgsMtsToAdd])
            celppError.style.display = 'none'
            celppLayersToAdd.focus()

            // print tables
            updateSummary()
            printLayersDetails()
            printLayersSummary()

        }
    })

    // save layers
    celppSave.addEventListener("click", async() => {

        let errors = 0
        if (celppMU.value == '') {
            errors +=1
            isInvalid([celppMU])    
        }
        
        
        if (errors == 0) {

            celpp.style.display = 'none'
            loader.style.display = 'block'
            body.innerHTML = ''

            let createResponseData = {}
            let editResponseData = {}
            let destroyResponseData = {}

            // element to create
            let create = g.layersDetails.filter( ld=> ld.type == 'create')
            if (create.length > 0) {
                create = create.map(({ id, ...rest }) => ({
                    ...rest,
                    mu: celppMU.value
                }))

                const createResponse = await fetch(dominio + 'apis/create/cuttings-layers',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(create)
                })

                createResponseData = await createResponse.json()

                console.log(createResponseData)
            }

            // element to edit
            let edit = g.layersDetails.filter( ld=> ld.type == 'edit')

            // elements to destroy
            let destroy = g.layersDetails.filter( ld=> ld.type == 'destroy')

            if (createResponseData.message == 'ok') {
                // get and print cuttings
                g.cuttings = await f.getData()
                printTable()
                okText.innerText = 'Capas editas con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al editar capas'
                showOkPopup(errorPopup)
            }

            printTable()
            loader.style.display = 'none'
        }
    })

    
}

export { celppEventListeners }