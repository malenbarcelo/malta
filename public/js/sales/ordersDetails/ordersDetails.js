import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData, applyFilters, updateTableData } from "./functions.js"
import { printOrdersDetails } from "./printOrdersDetails.js"
import { printProductsToAdd } from "./printProductsToAdd.js"
import { closePopups, applyPredictElement, acceptWithEnterInput, showTableInfo, clearInputs, isValid, closeWithEscape, focusInputs } from "../../generalFunctions.js"

//popups events listeners
import { dlppEventListeners } from "./ordersDetailsDLPP.js"
import { loppEventListeners } from "./ordersDetailsLOPP.js"
import { elppEventListeners } from "./ordersDetailsELPP.js"
import { elcppEventListeners } from "./ordersDetailsELCPP.js"
import { elsppEventListeners } from "./ordersDetailsELSPP.js"
import { apppEventListeners } from "./ordersDetailsAPPP.js"

window.addEventListener('load',async()=>{

    //get data
    ordersDetailsLoader.style.display = 'block'
    
    const date0 = Date.now()
    await getData()
    const date1 = Date.now()
    console.log(date1-date0)

    //select order manager
    if (odg.userLogged == 'Esteban') {
        filterOrderManager.value = 4
        filterChannel.value = 2
    }
    if (odg.userLogged == 'Pedro') {
        filterOrderManager.value = 5
        filterChannel.value = 1
    }

    //apply filters
    applyFilters()

    //print orders
    printOrdersDetails()

    //popups event listeners
    dlppEventListeners() //DELET LINE POPUP
    loppEventListeners() //LINE OBSERVATIONS POPUP
    elppEventListeners() //EDIT LINE POPUP
    elcppEventListeners() //EDIT LINE COLORS POPUP
    elsppEventListeners() //EDIT LINE SIZES POPUP
    apppEventListeners() //ADD PRODUCT POPUP

    //table info events listeners
    const tableIcons = [
        {
            icon:elppIcon,
            right:'8.5%'
        },        
        {
            icon:loppIcon,
            right:'6%'
        },
        {
            icon:dlppIcon,
            right:'3%'
        }
    ]
        
    showTableInfo(tableIcons,268,100)

    //filters event listeners
    const filters = [filterOrder,filterProduct,filterCustomer,filterChannel,filterOrderStatus,filterItemStatus,filterOrderManager]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printOrdersDetails()
        })
    })

    //focus filters
    focusInputs(filters)

    //unfilter event listener
    unfilterOrdersDetails.addEventListener("click", async() => {

        ordersDetailsLoader.style.display = 'block'
        odg.ordersDetailsFiltered = odg.ordersDetails
        filterOrder.value = ''
        filterProduct.value = ''
        filterCustomer.value = ''
        filterOrderStatus.value = 'default'
        filterItemStatus.value = ''
        //filterFrom.value = ''
        //filterUntil.value = ''
        applyFilters()
        printOrdersDetails()
        ordersDetailsLoader.style.display = 'none'
        
    })

    //predicts elements
    applyPredictElement(odg.elementsToPredict)

    //close popups event listener
    closePopups(odg.popups)

    //close with escape
    closeWithEscape(odg.popups)

    //accept with enter inputs
    acceptWithEnterInput(apppCustomer,apppAddLine) //add product

    //DGAaddProduct    
    DGAaddProduct.addEventListener("click", async() => {
        const inputs = [apppReqQty,apppProduct, apppCustomer]
        clearInputs(inputs)
        isValid(inputs)
        apppError.style.display = 'none'
        odg.salesChannel = 0
        odg.productsToAdd = []
        printProductsToAdd()
        closeWithEscape(appp,inputs)
        appp.style.display = 'block'
    })

    const date2 = Date.now()

    console.log(date2-date1)

})
