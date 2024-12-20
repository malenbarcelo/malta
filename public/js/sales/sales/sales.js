import { dominio } from "../../dominio.js"
import sg from "./salesGlobals.js"
import { printTableSales,filterSales } from "./salesFunctions.js"
import { closePopups,closeWithEscape,predictElements,selectFocusedElement,showTableInfo,showOkPopup,clearFilters,selectWithClick } from "../../generalFunctions.js"

window.addEventListener('load',async()=>{

    //get data and complete globals
    const year = (new Date()).getFullYear()
    sg.year = year

    salesLoader.style.display = 'block'
    sg.sales = await (await fetch(dominio + 'apis/sales/consolidated-sales/' + year)).json()
    salesLoader.style.display = 'none'
    sg.salesFiltered = sg.sales
    sg.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    sg.salesChannels = await (await fetch(dominio + 'apis/data/sales-channels')).json()
    sg.filters = [filterOrder,filterCustomer,filterSalesChannels,filterMonth,filterDate]

    //print table
    printTableSales(sg.sales)
    
    //change year
    changeYearIcon.addEventListener("click", async(e) => {
        chyppYear.value = sg.year
        chypp.style.display = 'block'
    })

    //change year accept
    chyppAccept.addEventListener("click", async(e) => {
        const year = chyppYear.value
        sg.year = year
        salesLoader.style.display = 'block'
        sg.sales = await (await fetch(dominio + 'apis/sales/consolidated-sales/' + year)).json()
        sg.salesFiltered = sg.sales
        salesLoader.style.display = 'none'
        clearFilters(sg.filters)
        printTableSales(sg.sales)
        salesTitle.innerText = 'CONSOLIDADO DE VENTAS ' + year
        chypp.style.display = 'none'
    })
    
    //predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = filterCustomerUl
        const apiUrl = 'apis/data/customers/predict-customers/'
        const dataToPrint = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,dataToPrint,elementName)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = filterCustomerUl
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //data to predit
    const dataToSelect = [
        {
            name: 'customer_name',
            list: ulPredictedCustomers,
            input: filterCustomer
        }
    ]

    document.addEventListener('click', function(e) {
        const {clickPredictedElement,inputToClick} = selectWithClick(e,dataToSelect)
        if (clickPredictedElement && inputToClick.id == 'filterCustomer') {
            filterSales()
            printTableSales(sg.salesFiltered)
        }  
    })

    //filters event listeners
    sg.filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterSales()
            printTableSales(sg.salesFiltered)
        })
    })

    //unfilter event listener
    unfilterSales.addEventListener("click", async() => {
        salesLoader.style.display = 'block'

        //Let the browser render the change in the DOM before continuing
        requestAnimationFrame(() => {
            setTimeout(() => {
                sg.salesFiltered = sg.sales
                clearFilters(sg.filters)
                printTableSales(sg.salesFiltered)
                salesLoader.style.display = 'none'
            }, 0);
        })

    })

    //table info events listeners
    const tableIcons = [
        {
            icon:vsppIcon,
            right:'21.5%'
        },
        {
            icon:dsppIcon,
            right:'16.5%'
        }
    ]

    showTableInfo(tableIcons,270,150)

    //close popups event listener
    closePopups(sg.popups)

    //close with escape
    closeWithEscape(sg.popups)

    //accept delete sale
    dsppAccept.addEventListener("click", async() => {

        salesLoader.style.display = 'block'

        const data = {idSale:sg.idSaleToDelete}

        await fetch(dominio + 'apis/sales/cancel-order-ninox',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dspp.style.display = 'none'

        sg.sales = await (await fetch(dominio + 'apis/sales/consolidated-sales/' + year)).json()
        filterSales()
        printTableSales(sg.sales)

        salesLoader.style.display = 'none'

        showOkPopup(dsppOk)

    })

})