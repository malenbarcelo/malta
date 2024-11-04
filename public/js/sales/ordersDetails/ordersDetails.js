import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printOrdersDetails } from "./printOrdersDetails.js"
import { printProductsToAdd } from "./printProductsToAdd.js"
import { closePopups, applyPredictElement, selectFocusedElement,selectWithClick,showOkPopup,showTableInfo, clearInputs, isValid, closeWithEscape } from "../../generalFunctions.js"

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
    await getData()

    //select order manager
    if (odg.userLogged == 'Esteban') {
        filterOrderManager.value = 4
        //channel_2.checked = true
        //og.channelsChecked.push(channel_2)
    }
    if (odg.userLogged == 'Pedro') {
        filterOrderManager.value = 5
        //og.channelsChecked.push(channel_1)
        //channel_1.checked = true
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
            right:'6.5%'
        },        
        {
            icon:loppIcon,
            right:'4%'
        },
        {
            icon:dlppIcon,
            right:'1%'
        }
    ]
        
    showTableInfo(tableIcons,240,100)

    //filters event listeners
    const filters = [filterOrder,filterProduct,filterCustomer,filterOrderStatus,filterOrderManager]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printOrdersDetails()
        })
    })

    //unfilter event listener
    unfilterOrdersDetails.addEventListener("click", async() => {
        odg.ordersDetailsFiltered = odg.ordersDetails
        filterOrder.value = ''
        filterProduct.value = ''
        filterCustomer.value = ''
        filterOrderStatus.value = 'default'
        filterOrderManager.value = 'default'
        printOrdersDetails()
    })

    //predicts elements
    applyPredictElement(odg.elementsToPredict)

    //close popups event listener
    closePopups(odg.popups)

    //close with escape
    closeWithEscape(odg.popups)

    //DGAaddProduct    
    DGAaddProduct.addEventListener("click", async() => {
        const inputs = [apppProduct, apppCustomer]
        clearInputs(inputs)
        isValid(inputs)
        odg.salesChannel = 0
        odg.productsToAdd = []
        printProductsToAdd()
        closeWithEscape(appp,inputs)
        appp.style.display = 'block'
    })

})
