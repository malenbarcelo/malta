import g from "./globals.js"
import { printTable } from "./printTable.js"
import { f } from "./functions.js"
import { clearInputs, closePopups, closeWithEscape, applyPredictElement } from "../../generalFunctions.js"

// popups events listeners
import { cemppEventListeners } from "./moldsCEMPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    // popups events listeners
    cemppEventListeners() // cretae edit mold popup (cempp)

    // close popups
    closePopups(g.popups)
    closeWithEscape(g.popups)

    // get molds
    g.filters.page = 1
    g.filters.size = 18
    g.molds = await f.getData()
    printTable()

    // add data with scroll
    table.addEventListener('scroll', async () => {
        if (table.scrollTop > g.previousScrollTop) {  // down scroll
            if (table.scrollTop + table.clientHeight + 1 >= table.scrollHeight) {
                loader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1)){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newData = await f.getData()
                    g.molds = [...g.molds, ...newData]
                    printTable()
                }
                loader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = table.scrollTop
    })

    //filters event listeners
    const filters = [mold,description]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {

            loader.style.display = 'block'

            //complete filters
            g.filters.moldString = mold.value
            g.filters.description = description.value
            g.filters.page = 1

            //update scroll data
            g.loadedPages = new Set()
            g.previousScrollTop = 0

            //get and print data
            g.molds = await f.getData()
            printTable()

            table.scrollTop = 0            
            loader.style.display = 'none'
        })
    })

    // unfilter event listener
    unfilter.addEventListener("click", async() => {

        loader.style.display = 'block'

        // reset filters
        g.filters.moldString = ''
        g.filters.description = ''
        g.filters.page = 1

        // clear filters
        clearInputs(filters)

        // update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        // get and print data
        g.molds = await f.getData()
        console.log(g.molds)
        printTable()

        table.scrollTop = 0
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
            
            //get and print data
            g.molds = await f.getData()
            printTable()

            table.scrollTop = 0            
            loader.style.display = 'none'

        })

        desc.addEventListener("click", async() => {
            loader.style.display = 'block'
            asc.classList.remove('notVisible')
            desc.classList.add('notVisible')
            g.filters.order = '[["' + element + '","DESC"]]'
            
            //get and print data
            g.molds = await f.getData()
            printTable()

            table.scrollTop = 0            
            loader.style.display = 'none'
        })

        loader.style.display = 'none'

    })

    // crate mold
    DGAcreate.addEventListener("click", async() => {
        clearInputs(g.cemppInputs)
        cemppTitle.innerText = 'CREAR MOLDE'
        cemppCreate.classList.remove('notVisible')
        cemppEdit.classList.add('notVisible')
        cemppImageLabel.innerText = 'Imagen'
        cemppDrawingDiv.style.display = 'none'        
        cempp.style.display = 'block'
        cemppMold.focus()
    })

    loader.style.display = 'none'
})
