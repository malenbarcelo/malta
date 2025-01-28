import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printCustomers } from "./printCustomers.js"
import { showOkPopup, closePopups, applyPredictElement, showTableInfo, clearInputs, isValid, closeWithEscape } from "../../generalFunctions.js"

//popups events listeners
import { ccppEventListeners } from "./customersCCPP.js"

window.addEventListener('load',async()=>{

    //get data
    customersLoader.style.display = 'block'
    await getData()

    //popups event listeners
    ccppEventListeners() //CREATE CUSTOMER POPUP
    
    //table info events listeners
    const tableIcons = [
        {
            icon:ecppIcon,
            right:'8.5%'
        },        
        {
            icon:dcppIcon,
            right:'5.5%'
        }
    ]
        
    showTableInfo(tableIcons,240,100)

    //filters event listeners
    const filters = [filterCustomer, filterChannel]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printCustomers()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        applyFilters()
        printCustomers()
    })

    //predicts elements
    applyPredictElement(cg.elementsToPredict)

    //close popups event listener
    closePopups(cg.popups)

    //close with escape
    closeWithEscape(cg.popups)

    //DGAcreateCustomer    
    DGAcreateCustomer.addEventListener("click", async() => {
        clearInputs(cg.ccppInputs)
        isValid(cg.ccppInputs)
        filterCustomer.value = ''
        ccppTitle.innerText = 'CREAR CLIENTE'
        ccppCreate.style.display = 'block'
        ccppEdit.style.display = 'none'
        ccpp.style.display = 'block'
    })

    //CONFIRM POPUPS
    coppAccept.addEventListener("click", async() => {
        const data = [{
            id: cg.idCustomer,
            enabled:0
        }]

        await fetch(dominio + 'apis/update/data-customers',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get and print data
        copp.style.display = 'none'
        customersLoader.style.display = 'block'
        await getData()
        okppText.innerText = 'Cliente dado de baja con éxito'
        showOkPopup(okpp)
    })
})
