import { dominio } from "../../dominio.js"
import odg from "./ordersDetailsGlobals.js"
import { printTableOrdersDetails,filterOrdersDetails,printTableAddProducts } from "./ordersDetailsFunctions.js"
import { acceptWithEnter, predictElements, selectFocusedElement,selectWithClick,showOkPopup,showTableInfo } from "../../generalFunctions.js"

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
    const tableIcons = [
        {
            icon:elppIcon,
            right:'11.5%'
        },        
        {
            icon:loppIcon,
            right:'8.5%'
        },
        {
            icon:dlppIcon,
            right:'5.5%'
        }
    ]
        
    showTableInfo(tableIcons,250,100)

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

    //close popups
    const closePopups = [apppClose, apppCancel,dlppClose,dlppCancel,elppClose,loppClose,sscppClose]
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
        apppProduct.value = ''
        apppCustomer.value = ''
        odg.salesChannel = 0
        apppError.style.display = 'none'
        appp.style.display = 'block'
    })

    //select product event listener - predict elements
    apppProduct.addEventListener("input", async(e) => {
        const input = apppProduct
        const list = ulPredictedProducts2
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        const elementName = 'product2'
        predictElements(input,list,apiUrl,name,elementName)
    })

    apppProduct.addEventListener("keydown", async(e) => {
        const input = apppProduct
        const list = ulPredictedProducts2
        const elementName = 'product2'
        selectFocusedElement(e,input,list,elementName)
    })

    //select customer event listener - predict elements
    apppCustomer.addEventListener("input", async(e) => {
        const input = apppCustomer
        const list = ulPredictedCustomers2
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer2'
        predictElements(input,list,apiUrl,name,elementName)
    })

    apppCustomer.addEventListener("keydown", async(e) => {
        const input = apppCustomer
        const list = ulPredictedCustomers2
        const elementName = 'customer2'
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

    //add products
    apppAddLine.addEventListener("click", async(e) => {
        if (apppProduct.value == '' && apppCustomer.value == '') {
            apppError.innerText = 'Debe completar producto y cliente'
            apppError.style.display = 'block'
        }else{
            if (apppProduct.value != '' && apppCustomer.value != '') {
                const productsToAdd = odg.products.filter(p => p.description == apppProduct.value)
                const customer = odg.customers.filter(c => c.customer_name == apppCustomer.value)

                if (productsToAdd.length == 0) {
                    apppError.innerText = 'Producto inválido'
                    apppError.style.display = 'block'
                }else{
                    if (customer.length == 0) {
                        apppError.innerText = 'Cliente inválido'
                        apppError.style.display = 'block'
                    }else{
                        const id = odg.productsToAdd.length == 0 ? 1 : Math.max(...odg.productsToAdd.map(element => element.id)) + 1
                        odg.productsToAdd.push({
                            'id':id,
                            'customer':customer[0],
                            'products':productsToAdd
                        })
                        printTableAddProducts(odg.productsToAdd)
                        apppCustomer.value = ''
                        apppError.style.display = 'none'
                    }
                }
            }
        }
        
    })

    acceptWithEnter(apppCustomer,apppAddLine)

    apppAccept.addEventListener("click", async(e) => {

        const data = odg.productsToAdd
        odg.createOrder = false

        //find out if there are order to create
        let ordersToCreate = 0
        data.forEach(element => {
            const customerOrders = odg.orders.filter( o => o.id_customers == element.customer.id)
            if (customerOrders.length == 0) {
                ordersToCreate +=1
                odg.createOrder = true
                element.createOrder = true
            }else{
                element.createOrder = false
            }
        })

        if (ordersToCreate > 0 && odg.salesChannel == 0) {
            sscpp.style.display = 'block'
        }else{
            
            data.forEach(element => {
                if (element.createOrder == true) {
                    element.id_sales_channels = parseInt(odg.salesChannel)
                }
            })

            await fetch(dominio + 'apis/sales/add-products',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            odg.ordersDetails = await (await fetch(dominio + 'apis/sales/in-progress-orders/details')).json()
            odg.orders = await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
            odg.ordersDetailsFiltered = odg.ordersDetails
            
            //print table
            filterOrdersDetails()
            printTableOrdersDetails(odg.ordersDetails)

            appp.style.display = 'none'
            
            showOkPopup(apppOk)
        }

        
    })

    sscppAccept.addEventListener("click", async(e) => {
        odg.salesChannel = sscppSalesChannel.value
        sscpp.style.display = 'none'
        apppAccept.click()
    })




})
