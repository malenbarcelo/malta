import g from "./globals.js"
import { dominio } from "../../dominio.js"
import { printTable } from "./printTable.js"
import { f } from "./functions.js"
import { gf } from "../../globalFunctions.js"
import { clearInputs, closePopups, closeWithEscape, applyPredictElement, acceptWithEnterInput } from "../../generalFunctions.js"

// popups events listeners
import { cecppEventListeners } from "./cuttingsCECPP.js"
import { celppEventListeners } from "./cuttingsCELPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    //get general data
    const molds = await (await fetch(`${dominio}apis/get/cuttings-molds`)).json()
    g.molds = molds.rows    

    // popups events listeners
    cecppEventListeners() // cretae edit cutting popup (cecpp)
    celppEventListeners() // cretae edit layers popup (celpp)

    // close popups
    closePopups(g.popups)
    closeWithEscape(g.popups)

    // show tooltips
    gf.showTooltips(g.tooltips,239,100)

    // accept with enter
    acceptWithEnterInput(celppKgsMtsToAdd,celppAdd) // celpp

    // get cuttings
    g.filters.page = 1
    g.filters.size = 18
    g.cuttings = await f.getData()
    printTable()

    // // add data with scroll
    // table.addEventListener('scroll', async () => {
    //     if (table.scrollTop > g.previousScrollTop) {  // down scroll
    //         if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
    //             loader.style.display = 'block'                
    //             if (!g.loadedPages.has(g.filters.page + 1)){
    //                 g.filters.page += 1
    //                 g.loadedPages.add(g.filters.page)
    //                 const newData = await f.getData()
    //                 g.molds = [...g.molds, ...newData]
    //                 printTable()
    //             }
    //             loader.style.display = 'none'                
    //         }
    //     }
    //     // Update previous position
    //     g.previousScrollTop = table.scrollTop
    // })

    // //filters event listeners
    // const filters = [mold,description]
    // filters.forEach(filter => {
    //     filter.addEventListener("change", async() => {

    //         loader.style.display = 'block'

    //         //complete filters
    //         g.filters.moldString = mold.value
    //         g.filters.description = description.value
    //         g.filters.page = 1

    //         //update scroll data
    //         g.loadedPages = new Set()
    //         g.previousScrollTop = 0

    //         //get and print data
    //         g.molds = await f.getData()
    //         printTable()

    //         table.scrollTop = 0            
    //         loader.style.display = 'none'
    //     })
    // })

    // // unfilter event listener
    // unfilter.addEventListener("click", async() => {

    //     loader.style.display = 'block'

    //     // reset filters
    //     g.filters.moldString = ''
    //     g.filters.description = ''
    //     g.filters.page = 1

    //     // clear filters
    //     clearInputs(filters)

    //     // update scroll data
    //     g.loadedPages = new Set()
    //     g.previousScrollTop = 0

    //     // get and print data
    //     g.molds = await f.getData()
    //     console.log(g.molds)
    //     printTable()

    //     table.scrollTop = 0
    //     loader.style.display = 'none'
        
    // })

    //predicts elements
    applyPredictElement(g.elementsToPredict)

    // // order data
    // g.elementsToOrder.forEach(element => {

    //     const asc = document.getElementById('order_asc_' + element)
    //     const desc = document.getElementById('order_desc_' + element)

    //     asc.addEventListener("click", async() => {
    //         loader.style.display = 'block'
    //         asc.classList.add('notVisible')
    //         desc.classList.remove('notVisible')
    //         g.filters.order = '[["' + element + '","ASC"]]'
            
    //         //get and print data
    //         g.molds = await f.getData()
    //         printTable()

    //         table.scrollTop = 0            
    //         loader.style.display = 'none'

    //     })

    //     desc.addEventListener("click", async() => {
    //         loader.style.display = 'block'
    //         asc.classList.remove('notVisible')
    //         desc.classList.add('notVisible')
    //         g.filters.order = '[["' + element + '","DESC"]]'
            
    //         //get and print data
    //         g.molds = await f.getData()
    //         printTable()

    //         table.scrollTop = 0            
    //         loader.style.display = 'none'
    //     })

    //     loader.style.display = 'none'

    // })

    // crate cutting
    DGAcreate.addEventListener("click", async() => {
        clearInputs(g.cecppInputs)
        const date = new Date()
        date.setHours(date.getHours()-3)
        const formattedDate = date.toISOString().split('T')[0]
        cecppDate.value = formattedDate
        cecppTitle.innerText = 'CREAR CORTE'
        cecppCreate.classList.remove('notVisible')
        cecppEdit.classList.add('notVisible')
        cecpp.style.display = 'block'
        cecppCutting.focus()
    })

    loader.style.display = 'none'
})
