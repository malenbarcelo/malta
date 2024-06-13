import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import { getElements } from "../ordersGetElements.js"
import { getData } from "../ordersGetData.js"

import { productSelected, getColorsOptions, hideColorsInputs, updateOrderData, updateOrderDetails, printTableCreateEdit, printTableOrders } from "../ordersFunctions.js"
import { isValid, isInvalid, clearData } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get elements
    const {filters1, checks1, selects2, inputs3} = getElements()

    //get data
    const {customers,products,orders} = getData()    
    
    /*----------------------------orders.ejs-----------------------------*/
    //print table
    printTableOrders(orders,customers)

    //filters
    selects2.forEach(select => {
        select.addEventListener("change", async() => {
            let ordersFiltered = orders

            //customer
            const idCustomer = filterCustomer.value == 'default' ? '' :customers.filter(c => c.customer_name == filterCustomer.value)[0].id
            ordersFiltered = filterCustomer.value == 'default' ? ordersFiltered : ordersFiltered.filter(o => o.id_customers == idCustomer)
            
            //order
            ordersFiltered = filterOrder.value == 'default' ? ordersFiltered : ordersFiltered.filter(o => o.order_number == filterOrder.value)
            
            //order_manager
            ordersFiltered = filterOrderManager.value == 'default' ? ordersFiltered : ordersFiltered.filter(o => o.order_manager == filterOrderManager.value)
            
            //status
            ordersFiltered = filterOrderStatus.value == 'default' ? ordersFiltered : ordersFiltered.filter(o => o.status == filterOrderStatus.value)
            
            //payment status
            if (filterPaymentStatus.value == 'paid') {
                ordersFiltered = ordersFiltered.filter(o => o.balance == 0)
            }else{
                if (filterPaymentStatus.value == 'unpaid') {
                    ordersFiltered = ordersFiltered.filter(o => o.balance > 0)
                }
            }
            
            printTableOrders(ordersFiltered,customers)
        })
        
    })

    unfilterOrders.addEventListener("click", async() => {
        filterCustomer.value = 'default'
        filterOrder.value = 'default'
        filterOrderManager.value = 'default'
        filterOrderStatus.value = 'default'
        printTableOrders(orders,customers)
    })

    //view orders by channel
    /*allChannels.addEventListener("click", async() => {
        checks2.forEach(element => {
            if (allChannels.checked == true) {
                element.checked = true
            }else{
                element.checked = false
            }
        })
    })

    checks2.forEach(element => {

        element.addEventListener("click", async() => {

            allChannels.checked = false

            if (element.checked == true) {
                checkedElements.push(element)
            }else{
                checkedElements = checkedElements.filter(c => c != element)
            }
            console.log(checkedElements)
        })
        
    })*/


    //createEditOrder
    createEditOrder.addEventListener("click", async() => {
        //clear data
        clearData(inputs1,selects1, errorText1, bodyCreateEdit)
        globals.orderDetails = []

        //complete popup info
        const salesChannel = dif1.checked ? 'Difusión1' : 'Difusión2'
        const customer = filterCustomer.value
        const orderNumber = await (await fetch(dominio + 'apis/sales/' + salesChannel + '/new-order')).json()
        const customerData = customers.filter(c => c.customer_name == customer)[0]
        discount = customerData.discount
        const idCustomers = customerData.id
        globals.orderData.discount = parseFloat(discount,2)
        globals.orderData.subtotal = 0
        globals.orderData.total = 0
        globals.orderData.id_customers = idCustomers
        globals.orderData.sales_channel = salesChannel
        globals.orderData.order_number = orderNumber

        updateOrderData()

        customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

        //show popup
        createEditPopup.classList.add('slideIn')
    })

    closeCreateEditPopup.addEventListener("click", () => {
        createEditPopup.classList.remove('slideIn')
    })

    /*----------------------------ordersCreateEdit.ejs-----------------------------*/
    //search products
    selectProduct.addEventListener("input", async() => {

        if (selectProduct.value.length >= 3) {

            let id = 0
            
            const string = selectProduct.value.toLowerCase()
            predictedProducts = await (await fetch(dominio + 'apis/data/products/predict-products/' + string)).json()

            predictedProductsList.innerHTML = ''

            predictedProducts.forEach(element => {
                predictedProductsList.innerHTML += '<li class="liPredictedProducts" id="product_'+ id +'">' + element.description + '</li>'
                id += 1
            })

            productFocused = -1

            if (predictedProducts.length > 0) {
                predictedProductsList.style.display = 'block'
                
                for (let i = 0; i < predictedProducts.length; i++) {

                    const predictedProduct = document.getElementById('product_' + i)
                    
                    predictedProduct.addEventListener("mouseover", async() => {

                        //unfocus all elements
                        for (let j = 0; j < predictedProducts.length; j++) {
                            const predictedProduct = document.getElementById('product_' + j)
                            if (j == i ) {
                                predictedProduct.classList.add('predictedProductFocused')
                            }else{
                                predictedProduct.classList.remove('predictedProductFocused')
                            }                            
                        }
                    })
                    
                    predictedProduct.addEventListener("click", async() => {
                        productSelected(predictedProduct.innerText)                      
                    })
                }
            }

        }else{
            productFocused = -1
            predictedProductsList.style.display = 'none'
            predictedProductsList.innerHTML = ''
        }
    })

    selectProduct.addEventListener("keydown", async(e) => {
        if (e.key === 'ArrowDown' && predictedProducts.length > 0) {
            
            productFocused = (productFocused == predictedProducts.length-1) ? productFocused : (productFocused + 1)            
            
            elementToFocus = document.getElementById('product_' + productFocused)            
            elementToFocus.classList.add('predictedProductFocused')
            elementToFocus.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })

            if (productFocused > 0) {
                elementToUnfocus = document.getElementById('product_' + (productFocused-1))
                elementToUnfocus.classList.remove('predictedProductFocused')                
            }

        }else if(e.key === 'ArrowUp'){

            productFocused = (productFocused == 0) ? productFocused : (productFocused - 1)

            elementToFocus = document.getElementById('product_' + productFocused)            
            elementToFocus.classList.add('predictedProductFocused')
            elementToFocus.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })

            if (productFocused != -1) {
                elementToUnfocus = document.getElementById('product_' + (productFocused+1))
                elementToUnfocus.classList.remove('predictedProductFocused')                
            }
            
        }else if(e.key === 'Enter'){
            
            let productOptions = []

            if (productFocused == -1) {
                selectProduct.value = ''
                selectSize.innerHTML = '<option value="default" id="selectSizeDefault" selected></option>'
                colorsRow.classList.add('notVisible')
                hideColorsInputs()
            }else{
                productSelected(elementToFocus.innerText)
                
            }
            
            predictedProductsList.style.display = 'none'
        }
    })

    selectSize.addEventListener("change", async() => {
        getColorsOptions()
    })   

    saveOrder.addEventListener("click", async() => {

        let incompleteRows = 0
        
        globals.orderDetails.forEach(element => {
            if (element.rowStatus == 'Incompleto') {
                incompleteRows +=1
            }
        })

        if (incompleteRows > 0 || globals.orderDetails.length == 0) {
            globals.orderData.status = 'Incompleto'
        }else{
            globals.orderData.status = 'Completo'
        }

        globals.orderData.balance = globals.orderData.total

        const data = globals.orderData
        data.order_details = globals.orderDetails

        await fetch(dominio + 'apis/sales/save-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        window.location.href = '/sales/orders'

    })

    /*----------------------------ordersEditPopup.ejs-----------------------------*/
    cancelEdit.addEventListener("click", async() => {
        editPopup.style.display = 'none'
    })

    closeEditPopup.addEventListener("click", async() => {
        editPopup.style.display = 'none'
    })

    acceptEdit.addEventListener("click", async() => {
        //validations
        let errorsQty = 0
        inputs2.forEach(input => {
            const inputName = input.name
            const errorLabel = document.querySelector(`#${inputName}Label`)
            if (input.value == '') {
                errorsQty += 1
                isInvalid(errorLabel,input)
            }else{
                isValid(errorLabel,input)
            }
        })

        if (errorsQty > 0) {
            errorText2.classList.remove('notVisible')
        }else{
            errorText2.classList.add('notVisible')
            const id = orderDetailsId.innerText
            const unitPrice = parseFloat(editPrice.value,2)
            const qty = parseInt(editQty.value)
            const extendedPrice = unitPrice * qty

            globals.orderDetails = globals.orderDetails.map(element => {
                if (element.id == id) {
                  return {...element, unit_price: unitPrice, quantity: qty, extended_price: extendedPrice}
                }
                return element
            })

            updateOrderData()
            printTableCreateEdit()

            //close popup
            editPopup.style.display = 'none'
        }
    })
})