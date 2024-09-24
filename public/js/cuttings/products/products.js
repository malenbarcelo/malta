
import pg from "./globals.js"
import { showTableInfo, closePopupsEventListeners, clearInputs, isValid } from "../../generalFunctions.js"
import { getData } from "./functions.js"

//popups events listeners
import { cpppEventListeners } from "./productsCPPP.js"
import { esppEventListeners } from "./productsESPP.js"
import { ecppEventListeners } from "./productsECPP.js"

window.addEventListener('load',async()=>{

    //getData
    await getData()

    //POPUPS EVENTS LISTENERS
    cpppEventListeners() //CREATE PRODUCT POPUP (CPPP)
    esppEventListeners() //EDIT SIZES POPUP (ESPP)
    ecppEventListeners() //EDIT COLORS POPUP (ECPP)

    //close popups event listener
    const closePopups = [cpppClose,cpppCancel,esppClose,ecppClose]
    closePopupsEventListeners(closePopups)


    //crate product event listener
    DGAcreateProduct.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        clearInputs(inputs)
        isValid(inputs)
        pg.newProductColors = [{id:1,color:'Blanco'},{id:2,color:'Negro'}]
        pg.newProductSizes = [{id:1,size:'U'}]
        cpppSizes.value =  pg.newProductSizes.map(size => size.size).join(", ")
        cpppColors.value =  pg.newProductColors.map(color => color.color).join(", ")
        cppp.style.display = 'block'
    })
    
})
