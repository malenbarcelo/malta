import { validations, showOkPopup, dateToString } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
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
            date = date.toISOString().split('T')[0]

            const data = [{
                date: date,
                cutting: cecppCutting.value,
                id_molds: g.molds.find(m => m.mold == cecppMold.value).id,
                enabled:1
            }]

            const response = await fetch(dominio + 'apis/create/cuttings',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()

            if (responseData.message == 'ok') {
                const moldData = g.molds.find(m => m.mold == cecppMold.value)
                const newData = responseData.data[0]
                newData.mold_data = moldData
                newData.date = newData.date.split('T')[0]
                g.cuttings.push(newData)
                okText.innerText = 'Corte creado con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al crear el corte'
                showOkPopup(errorPopup)
            }

            printTable()
            loader.style.display = 'none'
        }
    })

    // // edit mold
    // cemppEdit.addEventListener("click", async() => {
        
    //     const errors = await validation()

    //     if (errors == 0) {

    //         cempp.style.display = 'none'
    //         loader.style.display = 'block'
    //         body.innerHTML = ''

    //         const formData = new FormData()
    //         formData.append('id', g.moldToEdit.id)
    //         formData.append('mold', cemppMold.value.trim())
    //         formData.append('description', cemppDescription.value.trim())
    //         if (cemppUnits.value != '') {
    //             formData.append('units_per_layer', parseInt(cemppUnits.value))
    //         }
    //         if (cemppImage.files.length > 0) {
    //             formData.append('cemppImage', cemppImage.files[0])
    //         }

    //         const response = await fetch(dominio + 'apis/update/cuttings-molds',{
    //             method:'POST',
    //             body: formData
    //         })

    //         const responseData = await response.json()

    //         if (responseData.message == 'ok') {
    //             const data = responseData.data[0]
    //             const element = g.molds.find(m => m.id === g.moldToEdit.id)
    //             if (element){
    //                 element.mold = data.mold,
    //                 element.description = data.description,
    //                 element.image = data.image || element.image
    //                 element.units_per_layer = data.units_per_layer
    //             }     
    //             okText.innerText = 'Molde creado con éxito'
    //             showOkPopup(okPopup)
    //         }else{
    //             errorText.innerText = 'Error al crear el molde'
    //             showOkPopup(errorPopup)
    //         }

    //         printTable()
    //         loader.style.display = 'none'
    //     }
    // })

    
}

async function validation(){

    let errors = 0

    // cecppDate
    const dateValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    errors += validations(cecppDate,dateValidations)    

    // cecppCutting
    const cuttingValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    let findCutting = await (await fetch(`${dominio}apis/get/cuttings?cutting=${cecppCutting.value.trim()}`)).json()
    findCutting = cecppCutting.value != '' && cecppCutting.value.trim() != g.cuttingToEdit.cutting && findCutting.rows.length > 0 ? true : false
    cuttingValidations.push({'validation':'existingData','text': 'El corte ingresado ya existe','result': findCutting})

    errors += validations(cecppCutting,cuttingValidations)

    // cecppMold
    const moldValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    const findMold = g.molds.find(m => m.mold == cecppMold.value) ? true : false
    moldValidations.push({'validation':'notExistingData','text': 'Molde inexistente','result': findMold})    

    errors += validations(cecppMold,moldValidations)

    return errors
    
}

export { cecppEventListeners }