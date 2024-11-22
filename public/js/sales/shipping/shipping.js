import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printTable } from "./printTable.js"
import { closePopups, showTableInfo, closeWithEscape, acceptWithEnterInput, clearInputs, applyPredictElement } from "../../generalFunctions.js"

//popups events listeners
import { eshppEventListeners } from "./shippingESHPP.js"
import { oippEventListeners } from "./shippingOIPP.js"
import { coppEventListeners } from "./shippingCOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    //get data
    await getData()

    //print table
    printTable()

    //table info events listeners
    showTableInfo(g.tableIcons,250,150)

    //close popups event listener
    closePopups(g.popups)

    //close with escape
    closeWithEscape(g.popups)

    //popups event listeners
    eshppEventListeners() //EDIT SHIPPING POPUP
    oippEventListeners() //ONE INPUT POPUP
    coppEventListeners() //CONFIRM POPUP
    
    //accept with enter popups
    acceptWithEnterInput(oipp,oippAccept) //create shipping method

    //filters event listeners
    const filters = [orderNumber, customer]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printTable()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        clearInputs(filters)
        applyFilters()
        printTable()
    })

    //predicts elements
    applyPredictElement(g.elementsToPredict)

})
