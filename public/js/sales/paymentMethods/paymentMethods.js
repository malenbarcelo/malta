import { dominio } from "../../dominio.js"
import pmg from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printPaymentMethods } from "./printPaymentMethods.js"
import { showOkPopup, closePopups, applyPredictElement, showTableInfo, clearInputs, isValid, closeWithEscape } from "../../generalFunctions.js"

//popups events listeners
import { cpmppEventListeners } from "./paymentMethodsCPMPP.js"

window.addEventListener('load',async()=>{

    //get data
    paymentMethodsLoader.style.display = 'block'
    await getData()

    //popups event listeners
    cpmppEventListeners() //CREATE PAYMENT METHOD POPUP
    
    //table info events listeners
    const tableIcons = [
        {
            icon:epmppIcon,
            right:'42.5%'
        },        
        {
            icon:dpmppIcon,
            right:'37.5%'
        }
    ]
        
    showTableInfo(tableIcons,253,100)

    //filters event listeners
    const filters = [filterMethod]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printPaymentMethods()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        applyFilters()
        printPaymentMethods()
    })

    // //predicts elements
    // applyPredictElement(pmg.elementsToPredict)

    //close popups event listener
    closePopups(pmg.popups)

    //close with escape
    closeWithEscape(pmg.popups)

    //DGAcreatePamymentMethod    
    DGAcreatePM.addEventListener("click", async() => {
        clearInputs(pmg.cpmppInputs)
        isValid(pmg.cpmppInputs)
        filterMethod.value = ''
        cpmppTitle.innerText = 'CREAR FORMA DE PAGO'
        cpmppCreate.style.display = 'block'
        cpmppEdit.style.display = 'none'
        cpmpp.style.display = 'block'
    })

    //CONFIRM POPUPS
    coppAccept.addEventListener("click", async() => {
        const data = {id: pmg.idPaymentMethod}

        await fetch(dominio + 'apis/sales/payment-methods/delete-payment-method',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get and print data
        copp.style.display = 'none'
        paymentMethodsLoader.style.display = 'block'
        await getData()
        okppText.innerText = 'Forma de pago dada de baja con éxito'
        showOkPopup(okpp)
    })
})
