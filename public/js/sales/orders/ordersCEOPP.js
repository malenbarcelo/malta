import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, clearInputs, showOkPopup,acceptWithEnter,selectFocusedElement,predictElements} from "../../generalFunctions.js"
import { filterOrders,printTableOrders, changeSizesOptions,printColorsOptions,updateOrderData,printTableCreateEdit } from "./ordersFunctions.js"
import { updateData } from "./functions.js"

//CREATE EDIT ORDER POPUP (CEOPP)
function ceoppEventListeners() {
    //createEdit order - selectProduct - predict elements
    selectProduct.addEventListener("input", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts
        const apiUrl = 'apis/data/products/predict-products/'
        const name = 'description'
        const elementName = 'product'
        predictElements(input,list,apiUrl,name,elementName)
    })

    selectProduct.addEventListener("keydown", async(e) => {
        const input = selectProduct
        const list = ulPredictedProducts
        const elementName = 'product'
        selectFocusedElement(e,input,list,elementName)
    })

    selectProduct.addEventListener("change", async(e) => {
        changeSizesOptions()
    })

    //createEdit order - selectsize
    selectSize.addEventListener("change", async() => {
        
        const selectedProduct = selectProduct.value
        const selectedSize = selectSize.value

        if (selectedProduct != 'default' && selectedSize != 'default') {

            const data = {
                selectedProduct: selectedProduct,
                size: selectedSize
            }
        
            const colorsOptions = await (
                await fetch(dominio + 'apis/cuttings/colors-options/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                })
            ).json()

            og.colorsOptions = colorsOptions.colors

            printColorsOptions(og.colorsOptions)
            
            //show scpp
            scppTitle.innerText = selectedProduct + ' - TALLE ' + selectedSize
            selectAllColors.checked = false
            scppError.style.display = 'none'
            og.selectedColors = []
            scpp.style.display = 'block'
    
        }else{
            scpp.style.display = 'none'
        }

        
    })

    selectAllColors.addEventListener("click", async() => {
        if (selectAllColors.checked) {
            og.colorsOptions.forEach((color,i) => {
                const check = document.getElementById('check_' + i)
                check.checked = true
            })
        }else{
            og.colorsOptions.forEach((color,i) => {
                const check = document.getElementById('check_' + i)
                check.checked = false
            })
        }
    })

    //createEdit order - edit discount
    cdppAccept.addEventListener("click", async() => {
        og.discount = cdppNewDiscount.value == '' ? 0 : cdppNewDiscount.value / 100
        og.orderData.discount = cdppNewDiscount.value == '' ? 0 : cdppNewDiscount.value / 100
        updateOrderData()
        cdpp.style.display = 'none'
    })

    //change discount with enter
    acceptWithEnter(cdppNewDiscount,cdppAccept)

    //createEdit order - save order
    DGAsaveOrder.addEventListener("click", async() => {

        let incompleteRows = 0
        
        og.orderDetails.forEach(element => {
            if (element.row_status == 'Incompleto') {
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

        if (og.action == 'create') {
            await fetch(dominio + 'apis/sales/save-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            ceoppOkText.innerText = 'Orden creada con éxito'
        }else{
            await fetch(dominio + 'apis/sales/edit-order',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            ceoppOkText.innerText = 'Orden editada con éxito'
        }

        updateData()
        ceopp.classList.remove('slideIn')
        showOkPopup(ceoppOk)

    })

    
}

export {ceoppEventListeners}