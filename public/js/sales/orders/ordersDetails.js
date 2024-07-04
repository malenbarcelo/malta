import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { printTableOrdersDetails,filterOrdersDetails } from "./ordersDetailsFunctions.js"
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
    odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
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

    //filters event listeners
    const filters = [filterProduct,filterCustomer,filterOrderStatus,filterOrderManager]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterOrdersDetails()
            printTableOrdersDetails(odg.ordersDetailsFiltered)
        })
    })

    //unfilter event listener
    unfilterOrdersDetails.addEventListener("click", async() => {
        odg.ordersDetailsFiltered = odg.ordersDetails
        filterProduct.value = ''
        filterCustomer.value = ''
        filterOrderStatus.value = 'default'
        filterOrderManager.value = 'default'
        printTableOrdersDetails(odg.ordersDetailsFiltered)
    })

    //filter product event listener - predict elements
    filterProduct.addEventListener("input", async(e) => {
        const input = filterProduct
        const list = ulPredictedProducts
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        const elementName = 'product'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterProduct.addEventListener("keydown", async(e) => {
        const input = filterProduct
        const list = ulPredictedProducts
        const elementName = 'product'
        selectFocusedElement(e,input,list,elementName)
    })

    //filter customer event listener - predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //close popups
    const closePopups = [dlppClose,dlppCancel]
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })

    //dlpp accept    
    dlppAccept.addEventListener("click", async() => {

        const orderToEditData = odg.orders.filter( o => o.id == odg.orderToEdit[0].id_orders)[0]
        const orderToEditAmount = orderToEditData.total
        
        const newDetails = odg.orderToEdit.filter(o => o.id != odg.idLineToDelete)
        
        const newAmount = newDetails.length == 0 ? 0 : newDetails.reduce((acum, line) => acum + parseFloat(line.extended_price,2), 0)
        
        console.log(newAmount)
    })


})
