import { dominio } from "../../dominio.js"
import sg from "./salesGlobals.js"
import { printTableSales,filterSales } from "./salesFunctions.js"
import { closePopupsEventListeners,acceptWithEnter,predictElements,selectFocusedElement,showTableInfo,showOkPopup } from "../../generalFunctions.js"

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
        printTableSales(sg.sales)
        salesTitle.innerText = 'CONSOLIDADO DE VENTAS ' + year
        chypp.style.display = 'none'
    })

    //change year accept with enter
    acceptWithEnter(chyppYear,chyppAccept)
    
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

    //filters event listeners
    const filters = [filterOrder,filterCustomer,filterSalesChannels,filterMonth,filterDate]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterSales()
            printTableSales(sg.salesFiltered)
        })
    })

    //unfilter event listener
    unfilterSales.addEventListener("click", async() => {
       sg.salesFiltered = sg.sales
        filterOrder.value = ''
        filterCustomer.value = ''
        filterSalesChannels.value = 'default'
        filterMonth.value = 'default'
        filterDate.value = ''
        printTableSales(sg.salesFiltered)
    })

    //table info events listeners
    const tableIcons = [vsppIcon,dsppIcon]
    showTableInfo(tableIcons,38.5,100)

    //close popups
    const closePopups = [chyppClose,chyppCancel,dsppCancel,dsppClose]
    closePopupsEventListeners(closePopups)

    //accept delete sale
    dsppAccept.addEventListener("click", async() => {

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

        showOkPopup(dsppOk)

    })

    
    

})