
import g from "./globals.js"
import { isValid } from "../../generalFunctions.js"
import { f } from "./functions.js"

async function printLayers() {
    
    const dataToPrint = g.action == 'create' ? g.layersToCreate : g.layersToEdit
        
    detailsBody.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'
                
        const row = document.createElement('tr')
        row.id = 'trLayers_' + element.position

        row.innerHTML = `
            <th class="${rowClass}">${element.position}</th>
            <th class="${rowClass}">${element.color || ''}</th>
            <th class="${rowClass}">${element.layers || ''}</th>
            <th class="${rowClass}">${element.kgs_mts || ''}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="editRow_${element.position}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    detailsBody.appendChild(fragment)

    // event listeners
    layersEventListeners() 
}

function layersEventListeners() {

    const data = g.action == 'create' ? g.layersToCreate : g.layersToEdit

    data.forEach(element => {

        const editRow = document.getElementById('editRow_' + element.position)
        const trLayers = document.getElementById('trLayers_' + element.position)

        // edit
        editRow.addEventListener('click',async()=>{
            isValid([elppColor, elppLayers, elppKgsMts])
            elppColor.value = element.color
            elppLayers.value = element.layers
            elppKgsMts.value = element.kgs_mts
            
            g.positionToEdit = element.position
            elppTitle.innerText = 'EDITAR LÍNEA ' + element.position
            elpp.style.display = 'block'
            elppColor.focus()
        })

        //edit row with double click
        trLayers.addEventListener('dblclick',async()=>{
            editRow.click()
        })
        
    })
    
}

export { printLayers }