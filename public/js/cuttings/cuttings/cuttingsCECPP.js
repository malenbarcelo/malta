import { validations, showOkPopup, dateToString } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"

// create edit cutting popup (cecpp)
async function cecppEventListeners() {

    cecppMold.addEventListener("change", async() => {
        const mold = g.molds.find( m => m.mold == cecppMold.value)
        cecppDescription.value = mold ? mold.description : ''
    })

    // create cutting
    cecppCreate.addEventListener("click", async() => {
        
        const errors = await validation()

        if (errors == 0) {

            cecpp.style.display = 'none'
            loader.style.display = 'block'
            body.innerHTML = ''

            let date = new Date(cecppDate.value)
            date.setHours(date.getHours() + 3)

            const data = [{
                date: date,
                cutting: cecppCutting.value,
                description: cecppDescription.value,
                id_molds: g.molds.find(m => m.mold == cecppMold.value).id,
                enabled:1
            }]

            const response = await fetch(dominio + 'apis/create/cuttings',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            // update page
            g.filters.page = 1

            // update scroll data
            g.loadedPages = new Set()
            g.previousScrollTop = 0

            if (responseData.message == 'ok') {
                g.cuttings = await f.getData()    
                okText.innerText = 'Corte creado con éxito'
                showOkPopup(okPopup)
            }else{                errorText.innerText = 'Error al crear el corte'
                showOkPopup(errorPopup)
            }

            // print table
            printTable()

            loader.style.display = 'none'
        }
    })

    // edit cutting
    cecppEdit.addEventListener("click", async() => {
        
        const errors = await validation()

        if (errors == 0) {

            cecpp.style.display = 'none'
            loader.style.display = 'block'
            body.innerHTML = ''

            let date = new Date(cecppDate.value)
            date.setHours(date.getHours() + 3)

            const data = [{
                id: g.cuttingToEdit.id,
                date: date,
                cutting: cecppCutting.value,
                description: cecppDescription.value,
                id_molds: g.molds.find(m => m.mold == cecppMold.value).id
            }]

            const response = await fetch(dominio + 'apis/update/cuttings',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            // update page
            g.filters.page = 1

            // update scroll data
            g.loadedPages = new Set()
            g.previousScrollTop = 0

            if (responseData.message == 'ok') {
                g.cuttings = await f.getData()    
                okText.innerText = 'Corte editado con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al editar el corte'
                showOkPopup(errorPopup)
            }

            printTable()
            loader.style.display = 'none'
        }
    })
}

async function validation(){

    let errors = 0

    // cecppDate
    const dateValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    errors += validations(cecppDate,dateValidations)    

    // cecppCutting
    const cuttingValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    let findCutting = await (await fetch(`${dominio}apis/get/cuttings?cutting=${cecppCutting.value.trim()}`)).json()
    findCutting = cecppCutting.value != '' && ((g.action == 'editCutting' && cecppCutting.value.trim() != g.cuttingToEdit.cutting && findCutting.rows.length > 0) || (g.action == 'createCutting' && findCutting.rows.length > 0 )) ? true : false
    cuttingValidations.push({'validation':'existingData','text': 'El corte ingresado ya existe','result': findCutting})

    errors += validations(cecppCutting,cuttingValidations)

    // cecppMold
    const moldValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    const findMold = g.molds.find(m => m.mold == cecppMold.value) ? true : false
    moldValidations.push({'validation':'notExistingData','text': 'Molde inexistente','result': findMold})
    
    // cecppDescription
    const descriptionValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    errors += validations(cecppDescription,descriptionValidations)

    return errors
    
}

export { cecppEventListeners }