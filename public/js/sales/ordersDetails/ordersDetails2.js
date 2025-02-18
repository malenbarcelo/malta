import { dominio } from "../../dominio.js"
import { f } from "./functions2.js"
import { gf } from "../../globalFunctions.js"
import { clearInputs, focusInputs, applyPredictElement, closePopups, acceptWithEnterInput, closeWithEscape, isValid } from "../../generalFunctions.js"
import g from "./globals2.js"
import { printDetails } from "./printDetails2.js"
import { printProductsToAdd } from "./printProductsToAdd.js"

//popups events listeners
import { elppEventListeners } from "./ordersDetailsELPP.js"
import { dlppEventListeners } from "./ordersDetailsDLPP.js"
import { loppEventListeners } from "./ordersDetailsLOPP.js"
// import { elcppEventListeners } from "./ordersDetailsELCPP.js"
// import { elsppEventListeners } from "./ordersDetailsELSPP.js"
import { apppEventListeners } from "./ordersDetailsAPPP.js"

window.addEventListener('load',async()=>{

    // show loader
    ordersDetailsLoader.style.display = 'block'

    //popups event listeners
    dlppEventListeners() // delete line
    loppEventListeners() // line observations
    elppEventListeners() // edit line
    // elcppEventListeners() // edit line colors
    // elsppEventListeners() // edit line sizes
    apppEventListeners() // add product

    // get general data
    await f.getGeneralData()

    //get first page data and print table
    g.details = await f.getDetails()
    printDetails()

    // add data with scroll
    ordersDetailsTable.addEventListener('scroll', async () => {
        if (ordersDetailsTable.scrollTop > g.previousScrollTop) {  // down scroll
            if (ordersDetailsTable.scrollTop + ordersDetailsTable.clientHeight + 1 >= ordersDetailsTable.scrollHeight) {
                ordersDetailsLoader.style.display = 'block'                
                if (!g.loadedPages.has(g.filters.page + 1)){
                    g.filters.page += 1
                    g.loadedPages.add(g.filters.page)
                    const newDetails = await f.getDetails()
                    g.details = [...g.details, ...newDetails]
                    printDetails()
                }
                ordersDetailsLoader.style.display = 'none'                
            }
        }
        // Update previous position
        g.previousScrollTop = ordersDetailsTable.scrollTop
    })

    // show tooltips
    gf.showTooltips(g.tooltips,252,100)

    // hide loader
    ordersDetailsLoader.style.display = 'none'

    //filters event listeners
    const filters = [filterOrder,filterProduct,filterCustomer,filterChannel,filterOrderStatus,filterItemStatus]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            ordersDetailsLoader.style.display = 'block'

            //complete filters
            g.filters.order_number = filterOrder.value
            g.filters.customer_name = filterCustomer.value
            g.filters.description = filterProduct.value
            g.filters.id_sales_channels = filterChannel.value
            g.filters.id_orders_status = filterOrderStatus.value
            g.filters.item_status = filterItemStatus.value
            g.filters.page = 1

            //update scroll data
            g.loadedPages = new Set()
            g.previousScrollTop = 0

            //get and print data
            g.details = await f.getDetails()
            printDetails()

            ordersDetailsTable.scrollTop = 0
            
            ordersDetailsLoader.style.display = 'none'
        })
    })

    // focus filters
    focusInputs(filters)

    // unfilter event listener
    unfilterOrdersDetails.addEventListener("click", async() => {

        ordersDetailsLoader.style.display = 'block'

        // reset filters
        g.filters.order_number = ''
        g.filters.customer_name = ''
        g.filters.description = ''
        g.filters.id_sales_channels = ''
        g.filters.id_orders_status = ''
        g.filters.item_status = ''
        g.filters.page = 1

        // clear filters
        clearInputs(filters)

        // update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        // get and print data
        g.details = await f.getDetails()
        printDetails()

        ordersDetailsTable.scrollTop = 0

        ordersDetailsLoader.style.display = 'none'
        
    })

    //predicts elements
    applyPredictElement(g.elementsToPredict)

    //close popups event listener
    closePopups(g.popups)

    //close with escape
    closeWithEscape(g.popups)

    // accept with enter
    acceptWithEnterInput(elppPrice,elppAccept) // elpp
    acceptWithEnterInput(elppQtyR,elppAccept) // elpp
    acceptWithEnterInput(elppQtyC,elppAccept) // elpp
    acceptWithEnterInput(apppCustomer,apppAddLine) // appp
    acceptWithEnterInput(erqppQty,erqppAccept) // erqpp

    //DGAaddProduct    
    DGAaddProduct.addEventListener("click", async() => {

        ordersDetailsLoader.style.display = 'block'

        const inputs = [apppProduct, apppCustomer]
        g.customers = g.customers.length == 0 ? await (await fetch(`${dominio}apis/get/data-customers`)).json() : g.customers
        g.products = g.products.length == 0 ? await (await fetch(`${dominio}apis/get/cuttings-products?season=${g.season.season}`)).json() : g.products
        clearInputs(inputs)
        isValid(inputs)
        apppError.style.display = 'none'
        g.productsToAdd = []
        printProductsToAdd()
        appp.style.display = 'block'
        apppProduct.focus()

        ordersDetailsLoader.style.display = 'none'
    })
})
