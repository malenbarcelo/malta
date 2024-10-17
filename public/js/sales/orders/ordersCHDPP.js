import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { acceptWithEnter} from "../../generalFunctions.js"
import { updateOrderData} from "./functions.js"

//CHANGE DISCOUNT POPUP (CHDPP)
function chdppEventListeners() {

    chdppAccept.addEventListener("click", async() => {
        og.orderData.discount = chdppNewDiscount.value == '' ? 0 : chdppNewDiscount.value / 100
        updateOrderData()
        chdpp.style.display = 'none'
    })

    //change discount with enter
    acceptWithEnter(chdppNewDiscount,chdppAccept)

}

export {chdppEventListeners}