import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { clearInputs, showOkPopup,isValid} from "../../generalFunctions.js"
import { completeEPSPPsizes, completeEPCPPcolors, updateOrderData, getData, applyFilters} from "./functions.js"
import { printOrderDetails } from "./printOrderDetails.js"
import { printOrders } from "./printOrders.js"

//CREATE EDIT ORDER POPUP (CEOPP)
function ceoppEventListeners() {

    //close with X
    ceoppClose.addEventListener("click", () => {
        schpp.style.display = 'block'
    })

    //close with escape
    document.addEventListener('keydown', function(e) {
        const popup = document.getElementById('ceopp')
        if (e.key === 'Escape' && popup.classList.contains('slideIn')) {
            const activePopups = og.popups.filter(p => p.style.display == 'block')
            if (activePopups.length == 0) {
                og.escNumber += 1
                if (og.escNumber == 1) {
                    schpp.style.display = 'block'
                }else{
                    schpp.style.display = 'none'
                    popup.classList.remove('slideIn')
                    og.escNumber = 0
                }
            }
        }
        if (e.ctrlKey && e.key === "q" && popup.classList.contains('slideIn')) {
            const activePopups = og.popups.filter(p => p.style.display == 'block')
            if (activePopups.length == 0 && og.action == 'edit') {
                ceoppEdit.click()
            }
            if (activePopups.length == 0 && og.action == 'create') {
                ceoppCreate.click()
            }
        }  
    })

    //change select products
    selectProduct.addEventListener("change", async() => {

        ceoppAddError.style.display = 'none'

        if (selectProduct.value == '') {
            ceoppAttributes.style.display = 'none'
        }else{
            const selectedProduct = og.products.filter( p => p.full_description == selectProduct.value)
        
            //complete sizes
            const sizes = (selectedProduct[0].product_sizes.map(s => s.size_data.size)).join(', ')
            ceoppSizes.innerHTML = '<b>TALLES: </b>' + sizes
            if (sizes == 'U') {
                ceoppChangeSizes.style.display = 'none'
            }else{
                ceoppChangeSizes.style.display = 'block'
            }
            og.productSizes = selectedProduct[0].product_sizes
            og.selectedSizes = selectedProduct[0].product_sizes

            //complete colors
            const colors = selectedProduct[0].product_colors.length == 0 ? 'U' :  (selectedProduct[0].product_colors.map(c => c.color_data.color)).join(', ')
            ceoppColors.innerHTML = '<b>COLORES: </b>' + colors
            if (colors == 'U') {
                ceoppChangeColors.style.display = 'none'
            }else{
                ceoppChangeColors.style.display = 'block'
            }
            og.productColors = selectedProduct[0].product_colors
            og.selectedColors = selectedProduct[0].product_colors

            //show atributes
            ceoppAttributes.style.display = 'block'
        }
        
    })

    //edit sizes
    const ceoppChangeSizes = document.getElementById('ceoppChangeSizes')
    if (ceoppChangeSizes) {
        ceoppChangeSizes.addEventListener("click", async() => {
            completeEPSPPsizes()
            epsppError.style.display = 'none'
            epspp.style.display = 'block'
        })
    }

    //edit colors
    const ceoppChangeColors = document.getElementById('ceoppChangeColors')
    if (ceoppChangeColors) {
        ceoppChangeColors.addEventListener("click", async() => {
            completeEPCPPcolors()
            epcppError.style.display = 'none'
            epcpp.style.display = 'block'
        })
    }

    //add item
    ceoppAddItem.addEventListener("click", async() => {

        let errors = 0
        const findItem = og.orderDetails.filter(d => d.description == selectProduct.value)
        const itemToAdd = og.products.filter(p => p.full_description == selectProduct.value)

        if (itemToAdd.length == 0) {
            errors += 1
            ceoppAddError.innerText = 'Debe seleccionar un producto'
            ceoppAddError.style.display = 'block'
        }
        
        if (errors == 0 ) {
            if (findItem.length > 0) {
                aepppQuestion.innerHTML = 'El item <b>' + selectProduct.value + '</b> ya está en la orden, desea volver a agregarlo?'
                og.error = 1
                aeppp.style.display = 'block'
            }else{
                addItem(itemToAdd)                
            }
        }
    })

    //add existing item
    aepppAccept.addEventListener("click", async() => {
        const itemToAdd = og.products.filter(p => p.full_description == selectProduct.value)
        addItem(itemToAdd)
    })

    //cancel add existing item
    aepppCancel.addEventListener("click", async() => {
        clearInputs([selectProduct, ceoppReqQty, ceoppConfQty])
        selectProduct.focus()
    })

    //create product
    ceoppCreateProduct.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppFullDescription,cpppPrice]
        clearInputs(inputs)
        isValid(inputs)
        cpppTypeError2.style.display = 'none'
        cpppFabricError2.style.display = 'none'
        cpppCodeError2.style.display = 'none'
        cpppDescriptionError2.style.display = 'none'
        og.newProductColors = []
        og.newProductSizes = [{id:26,size:'U'}]
        cpppTitle.innerText = 'CREAR PRODUCTO'
        cpppEdit.classList.add('notVisible')
        cpppCreate.classList.remove('notVisible')
        cpppSizes.value =  og.newProductSizes.map(size => size.size).join(", ")
        cpppColors.value =  og.newProductColors.map(color => color.color).join(", ")
        cpppRemoveColor.checked = true
        cppp.style.display = 'block'
        cpppCode.focus()

    })

    //create product with enter
    selectProduct.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && selectProduct.value == '') {
            ceoppCreateProduct.click()
        }
    })

    //save order
    ceoppCreate.addEventListener("click", async() => {

        og.escNumber = 0

        let incompleteRows = 0
        
        og.orderDetails.forEach(element => {
            if (element.confirmed_quantity == '') {
                incompleteRows +=1
            }
        })

        //get new order status
        if (incompleteRows > 0 || og.orderDetails.length == 0) {
            og.orderData.id_orders_status = 1
        }else{
            og.orderData.id_orders_status = 2
        }

        const data = og.orderData
        data.order_details = og.orderDetails
        
        await fetch(dominio + 'apis/sales/create-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        ceopp.classList.remove('slideIn')
        await getData()
        applyFilters()
        await printOrders()
        okppText.innerText = 'Orden creada con éxito'
        showOkPopup(okpp)

    })

    //edit order
    ceoppEdit.addEventListener("click", async() => {

        og.escNumber = 0

        let responseStatus1
        let responseStatus2

        ceopp.classList.remove('slideIn')
        bodyOrders.innerHTML = ''
        ordersLoader.style.display = 'block'
        
        // get order status
        let incompleteRows = 0
        
        og.orderDetails.forEach(element => {
            if (element.confirmed_quantity === '' || element.confirmed_quantity === null) {
                incompleteRows +=1
            }
        })

        if (incompleteRows > 0 || og.orderDetails.length == 0) {
            og.orderData.id_orders_status = 1
        }else{
            og.orderData.id_orders_status = 2
        }

        // get payment status
        const transactions = await (await fetch(`${dominio}apis/get/sales-transactions?id_orders=${og.orderData.id}`)).json()
        const amountPaid = transactions.rows.reduce((sum, t) => sum + parseFloat(t.amount), 0)
        const orderTotal = og.orderData.total
        const orderBalance = orderTotal - amountPaid
        const idPaymentsStatus = amountPaid == 0 ? 3 : ((orderBalance == 0 && incompleteRows == 0) ? 5 : 4)
        
        og.orderData.season = og.season.season
        og.orderData.order_details = og.orderDetails
        og.orderData.id_payments_status = idPaymentsStatus

        const data = og.orderData
        
        const response = await fetch(dominio + 'apis/sales/edit-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        responseStatus1 = await response.json()

        // create not assigned payment if necessary
        if (responseStatus1.message == 'ok' && orderBalance < 0) {

            //get date
            let date = new Date()
            date = date.setHours(date.getHours() + 3)

            const data = [
                {
                    date:date,
                    amount: -orderBalance,
                    type:'PAGO NO ASIGNADO',
                    id_customers:og.orderData.id_customers
                },
                {
                    date:date,
                    amount: orderBalance,
                    type:'PAGO ASIGNADO',
                    id_customers:og.orderData.id_customers,
                    id_orders:og.orderData.id
                },
            ]

            const response = await fetch(dominio + 'apis/create/sales-transactions',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus2 = await response.json()

        }

        await getData()
        applyFilters()
        await printOrders()

        if (responseStatus1.message == 'ok' && (!responseStatus2 || (responseStatus2 && responseStatus2.message == 'ok'))) {
            okText.innerText = 'Orden editada con éxito'
            showOkPopup(okPopup)
        }else{
            errorText.innerText = 'Error al editar la orden'
            showOkPopup(errorPopup)
        }
    })
}

function addItem(itemToAdd) {
    
    ceoppAddError.style.display = 'none'
    const inputs = [selectProduct, ceoppReqQty, ceoppConfQty]
    const id = og.orderDetails.length == 0 ? 0 : (og.orderDetails.reduce((max, obj) => (obj.id > max ? obj.id : max), -Infinity) + 1)

    og.orderDetails.push({
        id: id,
        id_products: itemToAdd[0].id,
        description: itemToAdd[0].full_description,
        unit_price:itemToAdd[0].unit_price,
        required_quantity: ceoppReqQty.value,
        confirmed_quantity: ceoppConfQty.value,
        extended_price: ceoppConfQty.value == '' ? 0 : parseFloat(ceoppConfQty.value,2) * parseFloat(itemToAdd[0].unit_price,2),
        enabled:1,
        observations2:'',
        colors:og.selectedColors,
        sizes:og.selectedSizes,
        product_data: itemToAdd[0]
    })

    ceoppAttributes.style.display = 'none'
    aeppp.style.display = 'none'
    printOrderDetails()
    updateOrderData()
    clearInputs(inputs)
    selectProduct.focus()
}

export {ceoppEventListeners}