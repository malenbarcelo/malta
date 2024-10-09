import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { acceptWithEnter} from "../../generalFunctions.js"
import { completeEPSPPsizes, completeEPCPPcolors} from "./functions.js"


//CREATE EDIT ORDER POPUP (CEOPP)
function ceoppEventListeners() {

    //change select products
    selectProduct.addEventListener("change", async() => {

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

    //edit sizes
    const ceoppChangeColors = document.getElementById('ceoppChangeColors')
    if (ceoppChangeColors) {
        ceoppChangeColors.addEventListener("click", async() => {
            completeEPCPPcolors()
            epcppError.style.display = 'none'
            epcpp.style.display = 'block'
        })
    }
    


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
    // ceoppCreate.addEventListener("click", async() => {

    //     let incompleteRows = 0
        
    //     og.orderDetails.forEach(element => {
    //         if (element.row_status == 'Incompleto') {
    //             incompleteRows +=1
    //         }
    //     })

    //     //get new order status
    //     if (incompleteRows > 0 || og.orderDetails.length == 0) {
    //         og.orderData.id_orders_status = 1
    //     }else{
    //         og.orderData.id_orders_status = 2
    //     }

    //     const data = og.orderData
    //     data.order_details = og.orderDetails

    //     if (og.action == 'create') {
    //         await fetch(dominio + 'apis/sales/save-order',{
    //             method:'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(data)
    //         })
    //         ceoppOkText.innerText = 'Orden creada con éxito'
    //     }else{
    //         await fetch(dominio + 'apis/sales/edit-order',{
    //             method:'POST',
    //             headers: {'Content-Type': 'application/json'},
    //             body: JSON.stringify(data)
    //         })
    //         ceoppOkText.innerText = 'Orden editada con éxito'
    //     }

    //     updateData()
    //     ceopp.classList.remove('slideIn')
    //     showOkPopup(ceoppOk)

    // })

    
}

export {ceoppEventListeners}