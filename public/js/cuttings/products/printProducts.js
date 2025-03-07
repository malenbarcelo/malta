
import { dominio } from "../../dominio.js"
import pg from "./globals.js"
import {clearInputs,isValid} from "../../generalFunctions.js"

async function printProducts() {

    productsLoader.style.display = 'block'
    
    const dataToPrint = pg.productsFiltered
        
    bodyProducts.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const sizes = element.product_sizes.map(size => size.size_data.size).join(", ")
        const colors = element.product_colors.map(color => color.color_data.color).join(", ")

        
        const row = document.createElement('tr')
        row.id = 'tr_' + element.id

        row.innerHTML = `
            <th class="${rowClass}">${element.product_code}</th>
            <th class="${rowClass}">${element.description}</th>
            <th class="${rowClass}">${element.product_type.product_type}</th>
            <th class="${rowClass}">${element.product_fabric.fabric}</th>
            <th class="${rowClass}">${element.full_description}</th>
            <th class="${rowClass}">${element.unit_price}</th>
            <th class="${rowClass}">${colors}</th>
            <th class="${rowClass}">${sizes}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="destroy_${element.id}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    bodyProducts.appendChild(fragment)

    // Add customersevent listeners
    addEventListeners(dataToPrint)

    productsLoader.style.display = 'none'   
}

function addEventListeners(dataToPrint) {

    dataToPrint.forEach(element => {

        const edit = document.getElementById('edit_' + element.id)
        const destroy = document.getElementById('destroy_' + element.id)
        const tr = document.getElementById('tr_' + element.id)

        //edit row with double click
        tr.addEventListener('dblclick',async()=>{
            if (edit) {
                edit.click()
            }
        })

        destroy.addEventListener('click',async()=>{
            pg.idProductToDelete = element.id
            dpppQuestion.innerHTML = '¿Confirma que desea eliminar el producto <b>' + element.full_description + '</b>?'
            dppp.style.display = 'block'
        })

        edit.addEventListener('click',async()=>{

            const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppFullDescription,cpppPrice]
            clearInputs(inputs)
            isValid(inputs)
            cpppTypeError2.style.display = 'none'
            cpppFabricError2.style.display = 'none'
            cpppCodeError2.style.display = 'none'
            cpppDescriptionError2.style.display = 'none'
            pg.productColors = element.product_colors
            pg.productSizes = element.product_sizes
            pg.idProductToEdit = element.id
            pg.codeToEdit = element.product_code
            pg.action = 'edit'
            cpppTitle.innerText = 'EDITAR PRODUCTO'
            cpppEdit.classList.remove('notVisible')
            cpppCreate.classList.add('notVisible')
            cpppCode.value = element.product_code
            cpppDescription.value = element.description
            cpppType.value = element.product_type.product_type
            cpppFabric.value = element.product_fabric.fabric
            cpppFullDescription.value = cpppCode.value + ' - ' + cpppDescription.value  + ' - ' + cpppFabric.value
            cpppPrice.value = element.unit_price
            cpppSizes.value =  pg.productSizes.map(size => size.size_data.size).join(", ")
            cpppColors.value =  pg.productColors.map(color => color.color_data.color).join(", ")
            cpppRemoveColor.checked = false
            cppp.style.display = 'block'
        })
        
    })
    
}

export {printProducts}