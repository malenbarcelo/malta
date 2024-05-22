import { dominio } from "./dominio.js"
import { selectOptions, getSizesOptions, updateOrderData, updateOrderDetails, printTableCreateEdit, printTableOrders } from "./ordersFunctions.js"
import { isValid, isInvalid, clearData } from "./generalFunctions.js"
import globals from "./globals.js"

window.addEventListener('load',async()=>{

    //orders.ejs
    const createEditOrder = document.getElementById('createEditOrder')
    const filterCustomer = document.getElementById('filterCustomer')
    const filterOrder = document.getElementById('filterOrder')
    const filterOrderManager = document.getElementById('filterOrderManager')
    const filterOrderStatus = document.getElementById('filterOrderStatus')
    const filterPaymentStatus = document.getElementById('filterPaymentStatus')
    const unfilterOrders = document.getElementById('unfilterOrders')
    const selects2 = [filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    const allChannels = document.getElementById('allChannels')
    const dif1 = document.getElementById('dif1')
    const dif2 = document.getElementById('dif2')
    const onlinePandW = document.getElementById('onlinePandW')
    const onlineT = document.getElementById('onlineT')
    const checks2 = [dif1,dif2,onlinePandW,onlineT]
    const bodyOrders = document.getElementById('bodyOrders')
    
    //ordersCreateEdit.ejs
    const createEditPopup = document.getElementById('createEditPopup')
    const closeCreateEditPopup = document.getElementById('closeCreateEditPopup')
    const customerOrder = document.getElementById('customerOrder')
    const selectProduct = document.getElementById('selectProduct')
    const selectColor = document.getElementById('selectColor')
    const selectSize = document.getElementById('selectSize')
    const selects1 = [selectProduct,selectColor,selectSize]
    const quantity = document.getElementById('quantity')
    const inputs1 = [quantity]
    const createEditAddProduct = document.getElementById('createEditAddProduct')
    const errorText1 = document.getElementById('errorText1')
    const orderInfo = document.getElementById('orderInfo')
    const bodyCreateEdit = document.getElementById('bodyCreateEdit')
    const saveOrder = document.getElementById('saveOrder')
    let discount = 0
    let errorsQty = 0

    //ordersEditPopup.ejs
    const editPopup = document.getElementById('editPopup')
    const titleEditPopup = document.getElementById('titleEditPopup')
    const acceptEdit = document.getElementById('acceptEdit')
    const cancelEdit = document.getElementById('cancelEdit')
    const closeEditPopup = document.getElementById('closeEditPopup')
    const orderDetailsId = document.getElementById('orderDetailsId')
    const editPrice = document.getElementById('editPrice')
    const editQty = document.getElementById('editQty')
    const inputs2 = [editPrice, editQty]
    const errorText2 = document.getElementById('errorText2')

    //data
    const customers = await (await fetch(dominio + 'apis/data/customers')).json()
    const products = await (await fetch(dominio + 'apis/data/products')).json()
    const orders = await (await fetch(dominio + 'apis/sales/orders')).json()
    
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

        customerOrder.innerText = customer + ' - Pedido #' + orderNumber

        //show popup
        createEditPopup.classList.add('slideIn')
    })

    closeCreateEditPopup.addEventListener("click", () => {
        createEditPopup.classList.remove('slideIn')
    })

    /*----------------------------ordersCreateEdit.ejs-----------------------------*/
    selectProduct.addEventListener("change", async() => {
        const selectedProduct = selectProduct.value
        const productOptions = await (await fetch(dominio + 'apis/cuttings/product-options/' + selectedProduct)).json()
        selectOptions(productOptions)
    })

    selectColor.addEventListener("change", async() => {
        const selectedProduct = selectProduct.value
        const selectedColor = selectColor.value

        if (selectedProduct != 'default' && selectedColor != 'default') {
            const sizesOptions = await (await fetch(dominio + 'apis/cuttings/sizes-options/' + selectedProduct + '/' + selectedColor)).json()
            getSizesOptions(sizesOptions)
        }
    })

    createEditAddProduct.addEventListener("click", async() => {

        /*errorsQty = 0

        //selects validations
        selects1.forEach(select => {
            const selectName = select.name
            const errorLabel = document.querySelector(`#${selectName}Label`)
            if (select.value == 'default') {
                errorsQty += 1
                isInvalid(errorLabel,select)
            }else{
                isValid(errorLabel,select)
            }
        })

        //inputs validations
        inputs1.forEach(input => {
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
            errorText1.classList.remove('notVisible')
        }else{
            errorText1.classList.add('notVisible')
            updateOrderDetails(products)
            updateOrderData()
            printTableCreateEdit()
        }*/

        updateOrderDetails(products)
        updateOrderData()
        printTableCreateEdit()
        
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