import { dominio } from "../../dominio.js"
import { clearInputs, showOkPopup } from "../../generalFunctions.js"
import g from "./globals.js"
import { printTable } from "./printTable.js"
import { applyFilters, getData } from "./functions.js"

//EDIT SHIPPING POPUP (ESHPP)
async function eshppEventListeners() {

    eshppNewMethod.addEventListener("click", async() => {
        clearInputs([oippInput])
        oippInputError2.style.display = 'none'
        oippTitle.innerText = 'CREAR FORMA DE ENVÍO'
        oippInputLabel.innerText = 'Forma de envío'
        oipp.style.display = 'block'
        oippInput.focus()
    })

    //edit
    eshppAccept.addEventListener("click", async() => {
            
        const data = {
            idOrders: g.idOrderToEdit,
            idCustomers: g.idCustomerToEdit,
            editMobile: g.initialMobile == eshppMobile.value ? false : true,
            orders_data:{
                id_shipping_methods:parseInt(eshppMethod.value),
                shipping_number:eshppNumber.value,
                shipping_company:eshppCompany.value,
                shipping_observations:eshppObservations.value
            },
            mobile_data:{
                mobile:eshppMobile.value
            }
        }

        await fetch(dominio + 'apis/sales/shipping/edit',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        //get and print data
        loader.style.display = 'block'
        eshpp.style.display = 'none'
        await getData()
        applyFilters()
        printTable()
        okppText.innerText = 'Datos guardados con éxito'
        showOkPopup(okpp)
    })
}

export {eshppEventListeners}