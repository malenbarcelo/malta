
import pg from "./globals.js"
import { showTableInfo, closePopupsEventListeners, clearInputs, isValid, applyPredictElement } from "../../generalFunctions.js"
import { getData } from "./functions.js"
import { printProducts } from "./printProducts.js"
import { applyFilters } from "./filters.js"

//popups events listeners
import { cpppEventListeners } from "./productsCPPP.js"
import { esppEventListeners } from "./productsESPP.js"
import { ecppEventListeners } from "./productsECPP.js"

window.addEventListener('load',async()=>{

    productsLoader.style.display = 'block'

    //getData
    await getData()
    pg.elementsToPredict[0].apiUrl = 'apis/cuttings/products/predict-season-descriptions/' + pg.season.season + '/'

    //print products
    printProducts()

    //filters
    const filters = [filterType,filterCode,filterDescription]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printProducts()
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        pg.productsFiltered = pg.products
        clearInputs(filters)
        printProducts()
    })


    //POPUPS EVENTS LISTENERS
    cpppEventListeners() //CREATE PRODUCT POPUP (CPPP)
    esppEventListeners() //EDIT SIZES POPUP (ESPP)
    ecppEventListeners() //EDIT COLORS POPUP (ECPP)

    //close popups event listener
    const closePopups = [cpppClose,cpppCancel,esppClose,ecppClose]
    closePopupsEventListeners(closePopups)

    //filter customer event listener - predict elements
    applyPredictElement(pg.elementsToPredict)

    //crate product event listener
    DGAcreateProduct.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppFullDescription,cpppPrice]
        clearInputs(inputs)
        isValid(inputs)
        pg.newProductColors = [{id:1,color:'Blanco'},{id:2,color:'Negro'}]
        pg.newProductSizes = [{id:1,size:'U'}]
        pg.action = 'create'
        cpppTitle.innerText = 'CREAR PRODUCTO'
        cpppCode.removeAttribute('readonly')
        cpppEdit.classList.add('notVisible')
        cpppCreate.classList.remove('notVisible')
        cpppSizes.value =  pg.newProductSizes.map(size => size.size).join(", ")
        cpppColors.value =  pg.newProductColors.map(color => color.color).join(", ")
        cppp.style.display = 'block'
    })


    
})
