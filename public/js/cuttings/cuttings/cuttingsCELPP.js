import { validations, isInvalid, isValid,clearInputs, showOkPopup } from "../../generalFunctions.js"
import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { f } from "./functions.js"
import { printTable } from "./printTable.js"

// create edit layers popup (celpp)
async function celppEventListeners() {

    // close with X
    celppClose.addEventListener("click", () => {
        g.escNumber = 0
        schpp.style.display = 'block'
    })

    // close with escape
    document.addEventListener('keydown', function(e) {
        const popup = document.getElementById('celpp')
        if (e.key === 'Escape' && popup.style.display == 'block') {
            const activePopups = g.popups.filter(p => p.style.display == 'block')            
            if (activePopups.includes(schpp)) {
                if (g.escNumber == 0) {
                    schpp.style.display = 'none'
                }else{
                    f.restablishSelectedCuttings()
                    schpp.style.display = 'none'
                    popup.style.display = 'none'
                    g.escNumber = 0
                }
            }

            if (!activePopups.includes(schpp) && !activePopups.includes(dlpp)) {
                g.escNumber += 1
                schpp.style.display = 'block'
            }
        }
    })

    // change MU
    celppMU.addEventListener("change", () => {

        // update fabric mu
        g.selectedCuttingsToEdit.map( c => c.fabric_mu = celppMU.value)
        
        // print cutting orders
        f.printCuttingOrders()
    })

    // save changes
    celppSave.addEventListener("click", async() => {
        
        const errors = validation()

        if (errors == 0) {
            
            celpp.style.display = 'none'
            body.innerHTML = ''
            loader.style.display = 'block'

            const {responseData1, responseData2 } = await saveChanges()

            if (responseData1.message == 'ok' && responseData2.message == 'ok') {
                
                // update filters
                g.filters.page = 1
                g.filters.size = 25

                // update scroll data
                g.loadedPages = new Set()
                g.previousScrollTop = 0

                // get cuttings
                g.cuttings = await f.getData()                
                okText.innerText = 'Capas agregadas con éxito'
                showOkPopup(okPopup)
                
            }else{
                errorText.innerText = 'Error al ingresar las capas'
                showOkPopup(errorPopup)
            }

            f.restablishSelectedCuttings()
            printTable()

            loader.style.display = 'none'
            
        }
    })

    // print cutting order
    celppPrint.addEventListener("click", async() => {

        const errors = validation()

        if (errors == 0) {

            // print pdf
            const data = {
                cutting: g.selectedCuttingsToEdit.find( c => c.id == g.cuttingToEdit.id),
                cuttings: g.selectedCuttingsToEdit,
                layers: g.action == 'create' ? g.layersToCreate : g.layersToEdit
            }

            const response = await fetch(dominio + 'apis/composed/print-cutting-order', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            })

            if (!response.ok) {
                throw new Error('Error al generar el PDF')
            }
    
            // Convert answer to Blob
            const blob = await response.blob()
        
            // Create url
            const url = window.URL.createObjectURL(blob)
            const a = document.createElement('a')
            a.href = url
            a.download = 'ORDEN DE CORTE #' + data.layers[0].id_layers + '.pdf' // File name
            document.body.appendChild(a)
            a.click() //Simulate click
            a.remove() //Remove url from DOM
    
            //Release the temporary URL
            window.URL.revokeObjectURL(url)
        
            console.log('PDF descargado con éxito')

            loader.style.display = 'none'   
        }

    })

    // delete layer
    celppDelete.addEventListener("click", async() => {
        dlppQuestion.innerText = '¿Confirma que desea eliminar la orden de corte #' + g.layersToEdit[0].id_layers + '?'
        dlpp.style.display = 'block'
        
    })
}

// validations
function validation(){

    let errors = 0

    // celppMU
    const muValidations = [{'validation':'isEmpty','text': 'Campo requerido'}]
    errors += validations(celppMU,muValidations)

    return errors
    
}

// function to save changes
async function saveChanges(){

    let responseData1 = ''
    let responseData2 = ''            

    // complete MU
    g.selectedCuttingsToEdit.map( sc => sc.fabric_mu = celppMU.value)

    // edit cuttings
    const response1 = await fetch(dominio + 'apis/update/cuttings',{
        method:'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(g.selectedCuttingsToEdit)
    })

    responseData1 = await response1.json()

    //create or edit layers
    if (responseData1.message == 'ok' && g.action == 'create') {
        const response2 = await fetch(dominio + 'apis/create/cuttings-layers',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(g.layersToCreate)
        })

        responseData2 = await response2.json()
    }

    if (responseData1.message == 'ok' && g.action == 'edit') {
        const response2 = await fetch(dominio + 'apis/update/cuttings-layers',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(g.layersToEdit)
        })

        responseData2 = await response2.json()
    }

    return {responseData1, responseData2}

}

export { celppEventListeners }