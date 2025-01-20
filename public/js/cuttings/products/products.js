
import pg from "./globals.js"
import { dominio } from "../../dominio.js"
import { showTableInfo, closePopups, clearInputs, isValid, applyPredictElement,closeWithEscape } from "../../generalFunctions.js"
import { getData } from "./functions.js"
import { printProducts } from "./printProducts.js"
import { applyFilters } from "./filters.js"

//popups events listeners
import { cpppEventListeners } from "./productsCPPP.js"
import { esppEventListeners } from "./productsESPP.js"
import { ecppEventListeners } from "./productsECPP.js"
import { cdppEventListeners } from "./productsCDPP.js"
import { dpppEventListeners } from "./productsDPPP.js"

window.addEventListener('load',async()=>{

    productsLoader.style.display = 'block'

    //getData
    pg.currentSeason = await (await fetch(dominio + 'apis/main/current-season')).json()
    filterSeason.value = pg.currentSeason.season
    await getData()
    
    //print products
    printProducts()

    //filters
    const filters = [filterType,filterDescription]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printProducts()
        })
    })

    //change season
    filterSeason.addEventListener("change", async() => {
        filterSeason.value = filterSeason.value.toUpperCase()
        await getData()
        applyPredictElement(pg.elementsToPredict)
        applyFilters()
        printProducts()
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
    cdppEventListeners() //CREATE DATA POPUP (CDPP) --> popup from data.ejs
    dpppEventListeners() //DELETE PRODUCT POPUP (DPPP)
    
    //close popups event listener
    closePopups(pg.popups)

    //close with escape
    closeWithEscape(pg.popups)

    //predicts elements
    applyPredictElement(pg.elementsToPredict)

    //crate product event listener
    DGAcreateProduct.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppFullDescription,cpppPrice]
        clearInputs(inputs)
        isValid(inputs)
        cpppTypeError2.style.display = 'none'
        cpppFabricError2.style.display = 'none'
        cpppCodeError2.style.display = 'none'
        cpppDescriptionError2.style.display = 'none'
        pg.newProductColors = []
        pg.newProductSizes = [{id:26,size:'U'}]
        pg.action = 'create'
        pg.codeToEdit = ''
        cpppTitle.innerText = 'CREAR PRODUCTO'
        cpppEdit.classList.add('notVisible')
        cpppCreate.classList.remove('notVisible')
        cpppSizes.value =  pg.newProductSizes.map(size => size.size).join(", ")
        cpppColors.value =  pg.newProductColors.map(color => color.color).join(", ")
        cpppRemoveColor.checked = true
        cppp.style.display = 'block'
    })
})
