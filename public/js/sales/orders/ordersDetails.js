import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { printTableOrdersDetails } from "./ordersDetailsFunctions.js"


// import { getElements } from "./ordersGetElements.js"
// import { printTableOrders, filterOrders, updateOrderData, predictProducts, selectFocusedProduct, hideColorsInputs, getColorsOptions, printTableCreateEdit } from "./ordersFunctions.js"
// import { clearInputs, inputsValidation, showOkPopup } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get data and complete globals
    odg.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    odg.products = await (await fetch(dominio + 'apis/data/products')).json()    
    odg.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
    odg.ordersDetailsFiltered = odg.ordersDetails
    
    //print table
    printTableOrdersDetails(odg.ordersDetails)

    //table info events listeners
    const tableIcons = [elppIcon,dlppIcon]
    tableIcons.forEach(element => {
        const info = document.getElementById(element.id.replace('Icon','Info'))
        element.addEventListener("mouseover", async(e) => {
            const mouseX = e.clientX
            info.style.left = (mouseX - 30) + 'px'
            info.style.display = 'block'
        })
        element.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    })

})
