import { dominio } from "../../dominio.js"
import cg from "./cGlobals.js"
import { printCustomersSummary } from "./cPrintTables.js"
import { showTableInfo  } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    customersLoader.style.display = 'block'

    cg.customersSummary = await (await fetch(dominio + 'sales/customers/apis/customers-summary')).json()
    cg.customersSummaryFiltered = cg.customersSummary
    
    //table info events listeners
    const tableIcons = [vdppIcon]
    showTableInfo(tableIcons,37.5,100)

    //print tables
    printCustomersSummary(cg.customersSummaryFiltered)
    
    
    
    // //predict elements
    // filterCustomer.addEventListener("input", async(e) => {
    //     const input = filterCustomer
    //     const list = filterCustomerUl
    //     const apiUrl = 'apis/data/customers/predict-customers/'
    //     const dataToPrint = 'customer_name'
    //     const elementName = 'customer'
    //     predictElements(input,list,apiUrl,dataToPrint,elementName)
    // })
    

    // //data to predit
    // const dataToSelect = [
    //     {
    //         name: 'customer_name',
    //         list: ulPredictedCustomers,
    //         input: filterCustomer
    //     }
    // ]

    // document.addEventListener('click', function(e) {
    //     const {clickPredictedElement,inputToClick} = selectWithClick(e,dataToSelect)
    //     if (clickPredictedElement && inputToClick.id == 'filterCustomer') {
    //         filterSales()
    //         printTableSales(sg.salesFiltered)
    //     }  
    // })

    // //filters event listeners
    // sg.filters.forEach(filter => {
    //     filter.addEventListener("change", async() => {
    //         filterSales()
    //         printTableSales(sg.salesFiltered)
    //     })
    // })

    // //unfilter event listener
    // unfilterSales.addEventListener("click", async() => {
    //     salesLoader.style.display = 'block'

    //     //Let the browser render the change in the DOM before continuing
    //     requestAnimationFrame(() => {
    //         setTimeout(() => {
    //             sg.salesFiltered = sg.sales
    //             clearFilters(sg.filters)
    //             printTableSales(sg.salesFiltered)
    //             salesLoader.style.display = 'none'
    //         }, 0);
    //     })

    // })

    // //table info events listeners
    // const tableIcons = [vsppIcon,dsppIcon]
    // showTableInfo(tableIcons,38.5,100)

    // //close popups
    // const closePopups = [chyppClose,chyppCancel,dsppCancel,dsppClose]
    // closePopupsEventListeners(closePopups)

    

})