import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { printTableOrdersDetails } from "./ordersDetailsFunctions.js"
import { predictElements, selectFocusedElement } from "../../generalFunctions.js"


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

    //filter product event listener - predict elements
    filterProduct.addEventListener("input", async(e) => {
        const input = filterProduct
        const list = ulPredictedProducts
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        predictElements(input,list,apiUrl,name)
    })

    filterProduct.addEventListener("keydown", async(e) => {
        const input = filterProduct
        const list = ulPredictedProducts
        selectFocusedElement(e,input,list)
    })

    //filter customer event listener - predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        predictElements(input,list,apiUrl,name)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        selectFocusedElement(e,input,list)
    })

})
