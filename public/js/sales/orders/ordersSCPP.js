import og from "./ordersGlobals.js"
import { updateOrderData,printTableCreateEdit } from "./ordersFunctions.js"

//SELECT COLOR POPUP (SCPP)
function scppEventListeners() {
    
    scppAccept.addEventListener("click", async() => {

        og.colorsOptions.forEach((color,i) => {
            const check = document.getElementById('check_' + i)
            if (check.checked == true) {
                og.selectedColors.push({
                    i:i,
                    color:color
                })
            }
        })

        //validations
        if (og.selectedColors.length == 0) {
            scppError.style.display = 'block'
        }else{
            scppError.style.display = 'none'
            let id = og.orderDetails.length == 0 ? 1 : Math.max(...og.orderDetails.map(element => element.id)) + 1

            og.selectedColors.forEach((color) => {

                const product = og.products.filter( p => p.description == selectProduct.value && p.size == selectSize.value && p.color == color.color)[0]
                
                const unitPrice = product.unit_price
                const id_products = product.id
                const requiredInput = document.getElementById('required_' + color.i)
                const confirmedInput = document.getElementById('confirmed_' + color.i)
                
                og.orderDetails.push({
                    id: id,
                    id_products: id_products,
                    description: selectProduct.value,
                    size: selectSize.value,
                    color: color.color,
                    unit_price: parseFloat(unitPrice,2),
                    required_quantity: requiredInput.value,
                    confirmed_quantity: confirmedInput.value,
                    extended_price: confirmedInput.value == '' ? 0 : confirmedInput.value * unitPrice,
                    row_status: confirmedInput.value == '' ? 'Incompleto' : 'Completo'
                })
                id += 1
            })
            
            selectProduct.value = ''
            selectSize.value = ''
            scpp.style.display = 'none'
            updateOrderData()
            printTableCreateEdit(og.orderDetails)
        }

    })
        
}

export {scppEventListeners}