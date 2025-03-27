import g from "./globals.js"
import { dominio } from "../../dominio.js"
import { printTable } from "./printTable.js"
import { printLayers } from "./printLayers.js"
import { f } from "./functions.js"
import { gf } from "../../globalFunctions.js"
import { clearInputs, closePopups, closeWithEscape, applyPredictElement, acceptWithEnterInput, showOkPopup } from "../../generalFunctions.js"

// popups events listeners
import { cecppEventListeners } from "./cuttingsCECPP.js"
import { celppEventListeners } from "./cuttingsCELPP.js"
import { elppEventListeners } from "./cuttingsELPP.js"
import { schppEventListeners } from "./cuttingsSCHPP.js"
import { dlppEventListeners } from "./cuttingsDLPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    //get general data
    const molds = await (await fetch(`${dominio}apis/get/cuttings-molds`)).json()
    g.molds = molds.rows    

    // popups events listeners
    cecppEventListeners() // create edit cutting popup (cecpp)
    celppEventListeners() // create edit layers popup (celpp)
    elppEventListeners() // edit line popup (elpp)
    schppEventListeners() // save changes popup (schpp)
    dlppEventListeners() // delete layers popup (dlpp)

    // close popups
    const popupsToClose = g.popups.filter( p => p.id != 'celpp' && p.id != 'schpp')
    closePopups(popupsToClose)
    closeWithEscape(popupsToClose)

    // accept with enter
    acceptWithEnterInput(elppColor,elppSave)
    acceptWithEnterInput(elppLayers,elppSave)
    acceptWithEnterInput(elppKgsMts,elppSave)

    // show tooltips
    gf.showTooltips(g.tooltips,239,100)

    // restore data
    await f.restoreData()

    // add data with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1)){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await f.getData()
                    g.cuttings = [...g.cuttings, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    //filters event listeners
    const filters = [cutting,mold,description]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {

            loader.style.display = 'block'

            //complete filters
            g.filters.cutting = cutting.value
            g.filters.mold_string = mold.value
            g.filters.description = description.value

            // restore data
            await f.restoreData()
                        
            loader.style.display = 'none'
        })
    })

    // unfilter event listener
    unfilter.addEventListener("click", async() => {

        loader.style.display = 'block'

        // reset filters
        g.filters.cutting = ''
        g.filters.mold_string = ''
        g.filters.description = ''

        // clear filters
        clearInputs(filters)

        // restore data
        await f.restoreData()

        loader.style.display = 'none'
        
    })

    //predicts elements
    applyPredictElement(g.elementsToPredict)

    // order data
    g.elementsToOrder.forEach(element => {

        const asc = document.getElementById('order_asc_' + element)
        const desc = document.getElementById('order_desc_' + element)

        asc.addEventListener("click", async() => {
            loader.style.display = 'block'
            asc.classList.add('notVisible')
            desc.classList.remove('notVisible')
            g.filters.order = '[["' + element + '","ASC"]]'

            // restore data
            await f.restoreData()

            loader.style.display = 'none'

        })

        desc.addEventListener("click", async() => {
            loader.style.display = 'block'
            asc.classList.remove('notVisible')
            desc.classList.add('notVisible')
            g.filters.order = '[["' + element + '","DESC"]]'

            // restore data
            await f.restoreData()
                       
            loader.style.display = 'none'
        })

        loader.style.display = 'none'

    })

    // create cutting
    DGAcreate.addEventListener("click", async() => {
        loader.style.display = 'block'
        g.action = 'createCutting'
        clearInputs(g.cecppInputs)
        const date = new Date()
        date.setHours(date.getHours()-3)
        const formattedDate = date.toISOString().split('T')[0]
        const maxCuttingNumber = await (await fetch(`${dominio}apis/composed/max-cutting-number`)).json()
        cecppCutting.value = (maxCuttingNumber + 1) || 1
        cecppDate.value = formattedDate
        cecppTitle.innerText = 'CREAR CORTE'
        cecppCreate.classList.remove('notVisible')
        cecppEdit.classList.add('notVisible')
        cecpp.style.display = 'block'
        cecppMold.focus()
        loader.style.display = 'none'
    })

    // create layers
    DGAlayers.addEventListener("click", async() => {
        if (g.selectedCuttings.length == 0) {
            errorText.innerText = 'Debe seleccionar al menos un corte'
            showOkPopup(errorPopup)
        }else{
            loader.style.display = 'block'
            g.action = 'create'

            // clear inputs
            clearInputs([celppMU])

            // clear layers and update data
            f.clearLayersToCreate()
            f.updateTotalsData()
            f.printLayersSummary()
            f.updateLayersSummary()

            // complete layers_id            
            const maxId = await (await fetch(`${dominio}apis/composed/max-id-layers`)).json()
            const layersId = maxId == null ? 1 : maxId + 1 
            g.selectedCuttingsToEdit.map( sc => sc.id_layers = layersId)
            g.layersToCreate.map( l => l.id_layers = layersId)

            // print layers
            printLayers()

            // print cutting orders
            f.printCuttingOrders()

            celppDelete.style.display = 'none'
            celpp.style.display = 'block'
            loader.style.display = 'none'

        }
    })

    loader.style.display = 'none'
})
