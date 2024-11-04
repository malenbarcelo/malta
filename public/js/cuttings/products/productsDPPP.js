import { dominio } from "../../dominio.js"
import pg from "./globals.js"
import {inputsValidation, showOkPopup,isInvalid} from "../../generalFunctions.js"
import { getData,completeESPPsizes,completeECPPcolors } from "./functions.js"
import { printProducts } from "./printProducts.js"

//DELETE PRODUCT POPUP (DPPP)
async function dpppEventListeners() {
    
    //accept
    dpppAccept.addEventListener("click", async() => {
        
            
            const data = {id:pg.idProductToDelete}
    
            await fetch(dominio + 'apis/cuttings/products/delete-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            dppp.style.display = 'none'
            productsLoader.style.display = 'block'
            await getData()
            printProducts()
            okppText.innerText = 'Producto eliminado con éxito'
            showOkPopup(okpp)

    })

     
}

export {dpppEventListeners}