import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { clearInputs, showOkPopup,isValid} from "../../generalFunctions.js"
import { completeEPSPPsizes, completeEPCPPcolors, updateOrderData, getData, applyFilters} from "./functions.js"
import { printOrderDetails } from "./printOrderDetails.js"
import { printOrders } from "./printOrders.js"

//CREATE EDIT ORDER POPUP (CEOPP)
function ceoppEventListeners() {

    //close with escape
    document.addEventListener('keydown', function(e) {
        const popup = document.getElementById('ceopp')
        if (e.key === 'Escape' && popup.classList.contains('slideIn')) {
            schpp.style.display = 'block'
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

        const itemToAdd = og.products.filter(p => p.full_description == selectProduct.value)
        const findItem = og.orderDetails.filter(d => d.description == selectProduct.value)

        if (itemToAdd.length == 0) {
            errors += 1
            ceoppAddError.innerText = 'Debe seleccionar un producto'
            ceoppAddError.style.display = 'block'
        }

        if (findItem.length > 0) {
            errors += 1
            ceoppAddError.innerText = 'El producto seleccionado ya se encuentra en el pedido'
            ceoppAddError.style.display = 'block'
        }
        
        if (errors == 0 ) {
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
            printOrderDetails()
            updateOrderData()
            clearInputs(inputs)
            
        }
    })

    //create product
    ceoppCreateProduct.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppFullDescription,cpppPrice]
        clearInputs(inputs)
        isValid(inputs)
        cpppTypeError2.style.display = 'none'
        cpppFabricError2.style.display = 'none'
        cpppCodeError2.style.display = 'none'
        og.newProductColors = [{id:35,color:'BLANCO'},{id:36,color:'NEGRO'}]
        og.newProductSizes = [{id:26,size:'U'}]
        cpppTitle.innerText = 'CREAR PRODUCTO'
        cpppEdit.classList.add('notVisible')
        cpppCreate.classList.remove('notVisible')
        cpppSizes.value =  og.newProductSizes.map(size => size.size).join(", ")
        cpppColors.value =  og.newProductColors.map(color => color.color).join(", ")
        cpppRemoveColor.checked = false
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
        await applyFilters()
        await printOrders()
        okppText.innerText = 'Orden creada con éxito'
        showOkPopup(okpp)

    })

    //edit order
    ceoppEdit.addEventListener("click", async() => {

        let incompleteRows = 0
        
        og.orderDetails.forEach(element => {
            if (element.confirmed_quantity == '') {
                incompleteRows +=1
            }
        })

        //get order status
        if (incompleteRows > 0 || og.orderDetails.length == 0) {
            og.orderData.id_orders_status = 1
        }else{
            og.orderData.id_orders_status = 2
        }

        const data = og.orderData
        data.season = og.season.season
        data.order_details = og.orderDetails
        
        await fetch(dominio + 'apis/sales/edit-order',{
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
        okppText.innerText = 'Orden editada con éxito'
        showOkPopup(okpp)

    })

    
}

export {ceoppEventListeners}