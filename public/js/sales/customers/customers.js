import { dominio } from "../../dominio.js"
import cg from "./globals.js"
import { printCustomersSummary } from "./printTables.js"
import { applyFilters } from "./functions.js"
import { showTableInfo, predictElements,selectFocusedElement,clearFilters, closePopupsEventListeners  } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    customersLoader.style.display = 'block'

    cg.customersSummary = await (await fetch(dominio + 'sales/customers/apis/customers-summary')).json()
    cg.customersSummaryFiltered = cg.customersSummary
    
    //table info events listeners
    const tableIcons = [vdppIcon]
    showTableInfo(tableIcons,37.5,100)

    //print tables
    printCustomersSummary(cg.customersSummaryFiltered)
    
    //filter customer event listener - predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = filterCustomerUl
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = filterCustomerUl
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //filters
    const filters = [filterCustomer]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printCustomersSummary(cg.customersSummaryFiltered)
        })
    })

    //unfilter event listener
    unfilter.addEventListener("click", async() => {
        cg.customersSummaryFiltered = cg.customersSummary
        clearFilters(filters)
        printCustomersSummary(cg.customersSummaryFiltered)
    })

    // //table info events listeners
    // const tableIcons = [vsppIcon,dsppIcon]
    // showTableInfo(tableIcons,38.5,100)

    //close popups
    const closePopups = []
    closePopupsEventListeners(closePopups)

    //close side popup
    csppClose.addEventListener("click", async() => {
        csppCustomer.innerText = 
        cspp.classList.remove('slideIn')
    })

})