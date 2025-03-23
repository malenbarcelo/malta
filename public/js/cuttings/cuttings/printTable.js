
import g from "./globals.js"
import { dateToString, clearInputs, isValid } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import { f } from "./functions.js"
import { printLayers } from "./printLayers.js"

async function printTable() {
    
    const dataToPrint = g.cuttings
        
    body.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'
        const kgs = element.fabric_mu == 'KG' ? (element.kgs_mts || '') : ''
        const mts = element.fabric_mu == 'MT' ? (element.kgs_mts || '') : ''
        const layers = element.layers_data.reduce((sum, obj) => sum + (obj.layers == null ? 0 : parseFloat(obj.layers,2)), 0)
        const garments = (layers == 0 || element.base == null)? '' : layers * parseInt(element.base)
        const layerIcon = element.layers_data.length > 0 ? `<i class="fa-solid fa-pencil allowedIcon" id="editLayers_${element.id}"></i>` : `<input type="checkbox" id="check_${element.id}">`
                
        const row = document.createElement('tr')
        row.id = 'tr_' + element.id

        row.innerHTML = `
            <th class="${rowClass}">${dateToString(element.date)}</th>
            <th class="${rowClass}">${element.cutting}</th>
            <th class="${rowClass}">${element.mold_data.mold}</th>
            <th class="${rowClass}">${element.description}</th>
            <th class="${rowClass}">${kgs}</th>
            <th class="${rowClass}">${mts}</th>
            <th class="${rowClass}">${garments}</th>
            <th class="${rowClass}">${layerIcon}</th>
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

        const editLayers = document.getElementById('editLayers_' + element.id)
        const edit = document.getElementById('edit_' + element.id)
        const check = document.getElementById('check_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        if (check) {
            check.addEventListener('click',async()=>{
                if (g.selectedCuttings.includes(element)) {
                    g.selectedCuttings = g.selectedCuttings.filter( sc => sc != element)
                }else{
                    g.selectedCuttings.push(element)
                }
                g.selectedCuttingsToEdit = g.selectedCuttings.map(item => ({ ...item }))
            })
            
        }
        
        // edit layers
        if (editLayers) {
            editLayers.addEventListener('click',async()=>{    
                loader.style.display = 'block'
                g.action = 'edit'
                const layersToEdit = await (await fetch(`${dominio}apis/get/cuttings-layers?id_layers=${element.id_layers}`)).json()
                const cuttingsToEdit = await (await fetch(`${dominio}apis/get/cuttings?id_layers=${element.id_layers}`)).json()
                g.layersToEdit = layersToEdit.rows
                g.selectedCuttingsToEdit = cuttingsToEdit.rows
                celppMU.value = element.fabric_mu

                // clear inputs
                isValid([celppMU])

                // clear layers and update data
                f.clearLayersToCreate()
                f.updateTotalsData()
                f.printLayersSummary()
                f.updateLayersSummary()

                // print layers
                printLayers()

                // print cutting orders
                f.printCuttingOrders()
                
                celpp.style.display = 'block'
                loader.style.display = 'none'    
            })            
        }

        // edit cutting
        edit.addEventListener('click',async()=>{    
            loader.style.display = 'block'
            g.action = 'editCutting'
            g.cuttingToEdit = element
            cecppDate.value = element.date
            cecppCutting.value = element.cutting
            cecppMold.value = element.mold_data.mold
            cecppDescription.value = element.description
            cecppTitle.innerText = 'EDITAR CORTE'
            cecppCreate.classList.add('notVisible')
            cecppEdit.classList.remove('notVisible')
            cecpp.style.display = 'block'
            cecppMold.focus()
            
            loader.style.display = 'none'    
        })

        //edit row with double click
        tr.addEventListener('dblclick',async()=>{
            edit.click()
        })
        
    })
    
}

export { printTable }