import { validations, showOkPopup } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"

// create edit mold popup (cempp)
async function cemppEventListeners() {

    // create mold
    cemppCreate.addEventListener("click", async() => {
        
        const errors = await validation()

        if (errors == 0) {

            cempp.style.display = 'none'
            loader.style.display = 'block'
            body.innerHTML = ''

            const formData = new FormData()
            formData.append('mold', cemppMold.value.trim())
            formData.append('description', cemppDescription.value.trim())
            if (cemppUnits.value != '') {
                formData.append('units_per_layer', parseInt(cemppUnits.value))
            }
            if (cemppImage.files.length > 0) {
                formData.append('cemppImage', cemppImage.files[0])
            }

            const response = await fetch(dominio + 'apis/create/cuttings-molds',{
                method:'POST',
                body: formData
            })

            const responseData = await response.json()

            if (responseData.message == 'ok') {
                g.molds.push(responseData.data[0])
                okText.innerText = 'Molde creado con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al crear el molde'
                showOkPopup(errorPopup)
            }

            printTable()
            loader.style.display = 'none'
        }
    })

    // edit mold
    cemppEdit.addEventListener("click", async() => {
        
        const errors = await validation()

        if (errors == 0) {

            cempp.style.display = 'none'
            loader.style.display = 'block'
            body.innerHTML = ''

            const formData = new FormData()
            formData.append('id', g.moldToEdit.id)
            formData.append('mold', cemppMold.value.trim())
            formData.append('description', cemppDescription.value.trim())
            if (cemppUnits.value != '') {
                formData.append('units_per_layer', parseInt(cemppUnits.value))
            }
            if (cemppImage.files.length > 0) {
                formData.append('cemppImage', cemppImage.files[0])
            }

            const response = await fetch(dominio + 'apis/update/cuttings-molds',{
                method:'POST',
                body: formData
            })

            const responseData = await response.json()

            if (responseData.message == 'ok') {
                const data = responseData.data[0]
                const element = g.molds.find(m => m.id === g.moldToEdit.id)
                if (element){
                    element.mold = data.mold,
                    element.description = data.description,
                    element.image = data.image || element.image
                    element.units_per_layer = data.units_per_layer
                }     
                okText.innerText = 'Molde creado con éxito'
                showOkPopup(okPopup)
            }else{
                errorText.innerText = 'Error al crear el molde'
                showOkPopup(errorPopup)
            }

            printTable()
            loader.style.display = 'none'
        }
    })

    
}

async function validation(){

    let errors = 0

    // cemppMold
    const moldValidations = [{'validation':'isEmpty','text': 'Debe completar el campo'}]
    let findMold = []
    if (cemppMold.value != '' && cemppMold.value.trim() != g.moldToEdit.mold) {
        findMold = await (await fetch(`${dominio}apis/get/cuttings-molds?mold=${cemppMold.value.trim()}`)).json()
        findMold = findMold.rows.length > 0 ? true : false
        moldValidations.push({'validation':'existingData','text': 'El molde ingresado ya existe','result': findMold})
    }

    errors += validations(cemppMold,moldValidations)

    // cemppDescription
    errors += validations(cemppDescription, [{'validation':'isEmpty','text': 'Debe completar el campo'}])

    // image
    if (cemppImage.files.length > 0) {

        const allowedExtensions = ['jpg', 'png', 'jpeg']
        const imageValidations = [{'validation':'fileExtensions','text': 'El archivo debe tener extensión .jpg ó .png',allowedExtensions}]
        
        errors += validations(cemppImage,imageValidations)
    }

    return errors
    
}

export { cemppEventListeners }