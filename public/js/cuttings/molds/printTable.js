
import g from "./globals.js"
import { isValid } from "../../generalFunctions.js"

async function printTable() {
    
    const dataToPrint = g.molds
        
    body.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'
        const image = (element.image == null || element.image == '') ? '' : '<i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="image_' + element.id + '"></i></th>'
        
        const row = document.createElement('tr')
        row.id = 'tr_' + element.id

        row.innerHTML = `
            <th class="${rowClass}">${element.mold}</th>
            <th class="${rowClass}">${element.description}</th>
            <th class="${rowClass}">${image}</th>            
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

    g.molds.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const image = document.getElementById('image_' + element.id)        
        const tr = document.getElementById('tr_' + element.id)

        // image
        if (image) {
            image.addEventListener('click',async()=>{
                imppTitle.innerText = 'MODELO ' + element.mold
                imppImage.innerHTML = '<img src="/images/moldsImages/' + element.image + '" alt="Imagen modelo" class="moldImage"></img>'
                impp.style.display = 'block'
            })
        }
        
        // edit
        edit.addEventListener('click',async()=>{
            g.moldToEdit = element
            isValid(g.cemppInputs)
            cemppTitle.innerText = 'EDITAR MOLDE'
            cemppCreate.classList.add('notVisible')
            cemppEdit.classList.remove('notVisible')            
            cemppMold.value = element.mold
            cemppImage.value = ''
            cemppDescription.value = element.description
            cemppUnits.value = element.units_per_layer

            if (element.image == null || element.image == '') {
                cemppImageLabel.innerText = 'Imagen'
                cemppDrawingDiv.style.display = 'none'
            }else{
                cemppDrawingDiv.style.display = 'block'
                cemppImageLabel.innerText = 'Cambiar imagen'
                cemppDrawingDiv.innerHTML = '<img src="/images/moldsImages/' + element.image +'" alt="Imagen modelo" class="moldImage" id="cemppDrawing"></img>'
            }
                    
            cempp.style.display = 'block'
            cemppMold.focus()
        })

        //edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })
        
    })
    
}

export { printTable }