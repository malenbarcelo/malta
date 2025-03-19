
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
        const layers = element.layers_data.reduce((sum, obj) => sum + (obj.layers == null ? 0 : parseFloat(obj.layers,2)), 0)
        const garments = layers == 0 ? '' : layers * parseInt(element.base)
        const layerIcon = element.layers_data.length > 0 ? `<i class="fa-solid fa-pencil allowedIcon" id="editLayer_${element.id}"></i>` : `<input type="checkbox" id="check_${element.id}">`
                
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
            <th class="${rowClass}">${layerIcon}</th>
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

export { printTable }