import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printOrdersDetails } from "./printOrdersDetails.js"
import { closePopupsEventListeners, acceptWithEnter, applyPredictElement, selectFocusedElement,selectWithClick,showOkPopup,showTableInfo } from "../../generalFunctions.js"

//popups events listeners
import { dlppEventListeners } from "./ordersDetailsDLPP.js"
import { loppEventListeners } from "./ordersDetailsLOPP.js"
import { elppEventListeners } from "./ordersDetailsELPP.js"
import { elcppEventListeners } from "./ordersDetailsELCPP.js"
import { elsppEventListeners } from "./ordersDetailsELSPP.js"

window.addEventListener('load',async()=>{

    //get data
    ordersDetailsLoader.style.display = 'block'
    await getData()

    //popups event listeners
    dlppEventListeners() //DELET LINE POPUP
    loppEventListeners() //LINE OBSERVATIONS POPUP
    elppEventListeners() //EDIT LINE POPUP
    elcppEventListeners() //EDIT LINE COLORS POPUP
    elsppEventListeners() //EDIT LINE SIZES POPUP

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

    //close popups
    const closePopups = [dlppClose, loppClose, elppClose, elcppClose, elsppClose]
    closePopupsEventListeners(closePopups)

    

    
    // acceptWithEnter(elppPrice,elppAccept)
    // acceptWithEnter(elppQtyR,elppAccept)
    // acceptWithEnter(elppQtyC,elppAccept)

    // //DGAaddProduct    
    // DGAaddProduct.addEventListener("click", async() => {
    //     apppProduct.value = ''
    //     apppCustomer.value = ''
    //     odg.salesChannel = 0
    //     apppError.style.display = 'none'
    //     appp.style.display = 'block'
    // })

    // //select product event listener - predict elements
    // apppProduct.addEventListener("input", async(e) => {
    //     const input = apppProduct
    //     const list = ulPredictedProducts2
    //     const apiUrl = 'apis/data/products/predict-products/'
    //     const name = 'description'
    //     const elementName = 'product2'
    //     predictElements(input,list,apiUrl,name,elementName)
    // })

    // apppProduct.addEventListener("keydown", async(e) => {
    //     const input = apppProduct
    //     const list = ulPredictedProducts2
    //     const elementName = 'product2'
    //     selectFocusedElement(e,input,list,elementName)
    // })

    // //select customer event listener - predict elements
    // apppCustomer.addEventListener("input", async(e) => {
    //     const input = apppCustomer
    //     const list = ulPredictedCustomers2
    //     const apiUrl = 'apis/data/customers/predict-customers/'
    //     const name = 'customer_name'
    //     const elementName = 'customer2'
    //     predictElements(input,list,apiUrl,name,elementName)
    // })

    // apppCustomer.addEventListener("keydown", async(e) => {
    //     const input = apppCustomer
    //     const list = ulPredictedCustomers2
    //     const elementName = 'customer2'
    //     selectFocusedElement(e,input,list,elementName)
    // })

    
    // //add products
    // apppAddLine.addEventListener("click", async(e) => {
    //     if (apppProduct.value == '' && apppCustomer.value == '') {
    //         apppError.innerText = 'Debe completar producto y cliente'
    //         apppError.style.display = 'block'
    //     }else{
    //         if (apppProduct.value != '' && apppCustomer.value != '') {
    //             const productsToAdd = odg.products.filter(p => p.description == apppProduct.value)
    //             const customer = odg.customers.filter(c => c.customer_name == apppCustomer.value)

    //             if (productsToAdd.length == 0) {
    //                 apppError.innerText = 'Producto inválido'
    //                 apppError.style.display = 'block'
    //             }else{
    //                 if (customer.length == 0) {
    //                     apppError.innerText = 'Cliente inválido'
    //                     apppError.style.display = 'block'
    //                 }else{
    //                     const id = odg.productsToAdd.length == 0 ? 1 : Math.max(...odg.productsToAdd.map(element => element.id)) + 1
    //                     odg.productsToAdd.push({
    //                         'id':id,
    //                         'customer':customer[0],
    //                         'products':productsToAdd
    //                     })
    //                     printTableAddProducts(odg.productsToAdd)
    //                     apppCustomer.value = ''
    //                     apppError.style.display = 'none'
    //                 }
    //             }
    //         }
    //     }
        
    // })

    // acceptWithEnter(apppCustomer,apppAddLine)

    // apppAccept.addEventListener("click", async(e) => {

    //     const data = odg.productsToAdd
    //     odg.createOrder = false

    //     //find out if there are order to create
    //     let ordersToCreate = 0
    //     data.forEach(element => {
    //         const customerOrders = odg.orders.filter( o => o.id_customers == element.customer.id)
    //         if (customerOrders.length == 0) {
    //             ordersToCreate +=1
    //             odg.createOrder = true
    //             element.createOrder = true
    //         }else{
    //             element.createOrder = false
    //         }
    //     })

    //     if (ordersToCreate > 0 && odg.salesChannel == 0) {
    //         sscpp.style.display = 'block'
    //     }else{
            
    //         data.forEach(element => {
    //             if (element.createOrder == true) {
    //                 element.id_sales_channels = parseInt(odg.salesChannel)
    //             }
    //         })

    //         await fetch(dominio + 'apis/sales/add-products',{
    //             method:'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(data)
    //         })

    //         odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
    //         odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    //         odg.ordersDetailsFiltered = odg.ordersDetails
            
    //         //print table
    //         filterOrdersDetails()
    //         printTableOrdersDetails(odg.ordersDetails)

    //         appp.style.display = 'none'
            
    //         showOkPopup(apppOk)
    //     }

        
    // })

    // sscppAccept.addEventListener("click", async(e) => {
    //     odg.salesChannel = sscppSalesChannel.value
    //     sscpp.style.display = 'none'
    //     apppAccept.click()
    // })




})
