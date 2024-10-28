import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { updateOrderData} from "./functions.js"

//CHANGE DISCOUNT POPUP (CHDPP)
function chdppEventListeners() {

    chdppAccept.addEventListener("click", async() => {
        og.orderData.discount = chdppNewDiscount.value == '' ? 0 : chdppNewDiscount.value / 100
        updateOrderData()
        chdpp.style.display = 'none'
    })

}

export {chdppEventListeners}