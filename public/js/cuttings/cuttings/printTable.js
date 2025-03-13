
import g from "./globals.js"
import { dateToString, clearInputs, isValid } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"

async function printTable() {
    
    const dataToPrint = g.cuttings
        
    body.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'
        const kgs = (element.layers_data.length > 0 && element.layers_data[0].mu == 'KG') ? (element.layers_data.reduce((sum, obj) => sum + parseFloat(obj.kgs_mts,2), 0)).toFixed(2) : ''
        const mts = (element.layers_data.length > 0 && element.layers_data[0].mu == 'MT') ? (element.layers_data.reduce((sum, obj) => sum + parseFloat(obj.kgs_mts,2), 0)).toFixed(2) : ''
        const layers = element.layers_data.reduce((sum, obj) => sum + parseFloat(obj.layers,2), 0)
        const unitsPerLayer = (element.mold_data.units_per_layer == 0 || element.mold_data.units_per_layer == 0 || element.mold_data.units_per_layer == null) ? '' : parseFloat(element.mold_data.units_per_layer,2)
        const garments = (layers == 0 || unitsPerLayer == '0') ? '' : (layers / unitsPerLayer).toFixed(2)
                
        const row = document.createElement('tr')
        row.id = 'tr_' + element.id

        row.innerHTML = `
            <th class="${rowClass}">${dateToString(element.date)}</th>
            <th class="${rowClass}">${element.cutting}</th>
            <th class="${rowClass}">${element.mold_data.mold}</th>
            <th class="${rowClass}">${element.mold_data.description}</th>
            <th class="${rowClass}">${kgs}</th>
            <th class="${rowClass}">${mts}</th>
            <th class="${rowClass}">${garments}</th>
            <th class="${rowClass}"><i class="fa-solid fa-layer-group allowedIcon" id="layers_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-solid fa-scissors allowedIcon" id="cuttingOrder_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    body.appendChild(fragment)

    // event listeners
    eventListeners() 
}

function eventListeners() {

    g.cuttings.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const cuttingOrder = document.getElementById('cuttingOrder_' + element.id)
        const layers = document.getElementById('layers_' + element.id)        
        const tr = document.getElementById('tr_' + element.id)

        layers.addEventListener('click',async()=>{

            loader.style.display = 'block'

            celppTitle.innerText = "CORTE #" + element.cutting
            celppSubtitle.innerText =  'MOLDE ' + element.mold_data.mold + ' - ' + element.mold_data.description
            g.cuttingToEdit = element

            //clear inputs
            isValid([celppMU])
            clearInputs(g.celppInputs)
            celppError.style.display = 'none'

            // get data
            const order = '[["color","ASC"]]'
            const layersDetails = await (await fetch(`${dominio}apis/get/cuttings-layers?id_cuttings=${element.id}&order=${order}`)).json()
            g.layersDetails = layersDetails.rows
            g.layersSummary = await (await fetch(`${dominio}apis/composed/layers-summary?id_cuttings=${element.id}&order=${order}`)).json()

            //complete MU
            celppMU.value = g.layersDetails.length > 0 ? g.layersDetails[0].mu : ''

            // update summary
            celppUnitsPerLayer.value = element.mold_data.units_per_layer
            updateSummary(element)
            
            // print tables
            printLayersDetails()
            printLayersSummary()            
            
            celpp.style.display = 'block'
            celppColorToAdd.focus()
            loader.style.display = 'none'
        })

        cuttingOrder.addEventListener('click',async()=>{
            copp.style.display = 'block'
        })
        
        // // edit
        // edit.addEventListener('click',async()=>{
        //     g.moldToEdit = element
        //     isValid(g.cemppInputs)
        //     cemppTitle.innerText = 'EDITAR MOLDE'
        //     cemppCreate.classList.add('notVisible')
        //     cemppEdit.classList.remove('notVisible')            
        //     cemppMold.value = element.mold
        //     cemppDescription.value = element.description
        //     cemppUnits.value = element.units_per_layer

        //     if (element.image == null || element.image == '') {
        //         cemppImageLabel.innerText = 'Imagen'
        //         cemppDrawingDiv.style.display = 'none'
        //     }else{
        //         cemppDrawingDiv.style.display = 'block'
        //         cemppImageLabel.innerText = 'Cambiar imagen'
        //         cemppDrawingDiv.innerHTML = '<img src="/images/moldsImages/' + element.image +'" alt="Imagen modelo" class="moldImage" id="cemppDrawing"></img>'
        //     }
                    
        //     cempp.style.display = 'block'
        //     cemppMold.focus()
        // })

        // //edit row with double click
        // tr.addEventListener('dblclick',async()=>{
        //     if (edit) {
        //         edit.click()
        //     }
        // })
        
    })
    
}

function printLayersDetails() {

    layersLoader.style.display = 'block'        
    detailsBody.innerHTML = ''

    let counter = 0    
    
    // print details
    const detailsFragment = document.createDocumentFragment()
    g.layersDetails.forEach(element => {
        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'                
        const row = document.createElement('tr')
        row.id = 'tr_' + element.id
        row.innerHTML = `
            <th class="${rowClass}">${element.color}</th>
            <th class="${rowClass}">${element.layers}</th>
            <th class="${rowClass}">${element.kgs_mts}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="destroy_${element.id}"></i></th>
        `
        detailsFragment.appendChild(row)
        counter += 1
    })
    detailsBody.appendChild(detailsFragment)

    // // event listeners
    // eventListeners()

    layersLoader.style.display = 'none'
}

function printLayersSummary() {

    layersLoader.style.display = 'block'
    summaryBody.innerHTML = ''

    let counter = 0    
    
    // print summary
    const summaryFragment = document.createDocumentFragment()
    g.layersSummary.forEach(element => {
        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'                
        const row = document.createElement('tr')
        const garments = (celppUnitsPerLayer.value == '' || celppUnitsPerLayer.value == 0) ? '?' : (parseFloat(element.total_layers,2) / parseFloat(celppUnitsPerLayer.value,2)).toFixed(2)
        row.id = 'tr_' + element.id
        row.innerHTML = `
            <th class="${rowClass}">${element.color}</th>
            <th class="${rowClass}">${element.total_layers}</th>
            <th class="${rowClass}">${garments}</th>
        `
        summaryFragment.appendChild(row)
        counter += 1
    })
    summaryBody.appendChild(summaryFragment)

    layersLoader.style.display = 'none'
}

function updateSummary() {
    const layers = g.layersSummary.reduce((acum, item) => {
        return acum + parseInt(item.total_layers)
    }, 0)
    const kgsMts = g.layersSummary.reduce((acum, item) => {
        return acum + parseFloat(item.total_kgs_mts)
    }, 0)

    celppLayers.innerText = layers
    celppKgsMts.innerText = kgsMts.toFixed(2)
    celppGarments.innerText = (celppUnitsPerLayer.value == '' || celppUnitsPerLayer.value == 0) ? '?' : (parseFloat(layers,2) / parseFloat(celppUnitsPerLayer.value,2)).toFixed(2)

}

export { printTable, printLayersDetails, printLayersSummary, updateSummary }