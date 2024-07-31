import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { printTableOrdersDetails,filterOrdersDetails } from "./ordersDetailsFunctions.js"
import { acceptWithEnter, predictElements, selectFocusedElement,selectWithClick,showOkPopup } from "../../generalFunctions.js"


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
    const tableIcons = [elppIcon,dlppIcon,loppIcon]
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
    const filters = [filterOrder,filterProduct,filterCustomer,filterOrderStatus,filterOrderManager]
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

    //data to predit
    const dataToSelect = [
        {
            name: 'customer_name',
            list: ulPredictedCustomers,
            input: filterCustomer
        },
        {
            name: 'description',
            list: ulPredictedProducts,
            input: filterProduct
        }
    ]

    document.addEventListener('click', function(e) {
        const {clickPredictedElement,inputToClick} = selectWithClick(e,dataToSelect)
        if (clickPredictedElement && (inputToClick.id == 'filterCustomer' || inputToClick.id == 'filterProduct')) {
            filterOrdersDetails()
            printTableOrdersDetails(odg.ordersDetailsFiltered)
        }  
    })

    //close popups
    const closePopups = [apppClose, apppCancel,dlppClose,dlppCancel,elppClose,loppClose]
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })

    //dlpp accept    
    dlppAccept.addEventListener("click", async() => {

        const data = {
            lineToDelete:odg.lineToDelete
        }

        await fetch(dominio + 'apis/sales/cancel-order-detail',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
        odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        odg.ordersDetailsFiltered = odg.ordersDetails
        
        //print table
        printTableOrdersDetails(odg.ordersDetails)

        dlpp.style.display = 'none'

    })

    //elpp accept    
    elppAccept.addEventListener("click", async() => {

        const data = {
            lineToEdit:odg.lineToEdit,
            unit_price:elppPrice.value,
            required_quantity:elppQtyR.value,
            confirmed_quantity:elppQtyC.value
        }
        
        await fetch(dominio + 'apis/sales/edit-order-detail',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
        odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        odg.ordersDetailsFiltered = odg.ordersDetails
        
        //print table
        printTableOrdersDetails(odg.ordersDetails)

        elpp.style.display = 'none'
    })

    acceptWithEnter(elppPrice,elppAccept)
    acceptWithEnter(elppQtyR,elppAccept)
    acceptWithEnter(elppQtyC,elppAccept)

    //DGAaddProduct    
    DGAaddProduct.addEventListener("click", async() => {
        appp.style.display = 'block'
    })

    //select product event listener - predict elements
    selectProduct.addEventListener("input", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts2
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        const elementName = 'product'
        predictElements(input,list,apiUrl,name,elementName)
    })

    selectProduct.addEventListener("keydown", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts2
        const elementName = 'product'
        selectFocusedElement(e,input,list,elementName)
    })

    //select customer event listener - predict elements
    selectCustomer.addEventListener("input", async(e) => {
        const input = selectCustomer
        const list = ulPredictedCustomers2
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,name,elementName)
    })

    selectCustomer.addEventListener("keydown", async(e) => {
        const input = selectCustomer
        const list = ulPredictedCustomers2
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //save observations
    loppAccept.addEventListener("click", async() => {
        const data = {
            id: odg.lineToEdit.id,
            observations: loppObs.value
        }

        await fetch(dominio + 'apis/sales/edit-order-detail-observations',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
        odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        odg.ordersDetailsFiltered = odg.ordersDetails
        
        //print table
        printTableOrdersDetails(odg.ordersDetails)

        lopp.style.display = 'none'
        showOkPopup(loppOk)

    })

})
