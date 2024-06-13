import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import { getElements } from "./ordersGetElements.js"
import { printTableOrders, filterOrders } from "./ordersFunctions.js"

window.addEventListener('load',async()=>{

    //get elements
    const {filters1, checks1, selects2, inputs3, closePopups, tableIcons} = getElements()

    //get data and complete globals
    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.products = await (await fetch(dominio + 'apis/data/products')).json()
    og.orders = await (await fetch(dominio + 'apis/sales/orders')).json()
    og.ordersFiltered = og.orders
    og.checkedElements = checks1

    //print table
    printTableOrders(og.orders)

    //filters event listeners
    filters1.forEach(filter => {
        
        filter.addEventListener("change", async() => {
            filterOrders()
            printTableOrders(og.ordersFiltered)
        })
        
    })

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        filterCustomer.value = 'default'
        filterOrder.value = 'default'
        filterOrderManager.value = 'default'
        filterOrderStatus.value = 'default'
        allChannels.checked = true
        checks1.forEach(element => {
            element.checked = true
        })
        printTableOrders(og.ordersFiltered)
    })

    //view allChannels event lister
    allChannels.addEventListener("click", async() => {
        if (allChannels.checked) {
            og.checkedElements = checks1
            filterOrders()
            printTableOrders(og.ordersFiltered)
        }else{
            og.checkedElements = []
            filterOrders()
            printTableOrders(og.ordersFiltered)
        }
        checks1.forEach(element => {
            if (allChannels.checked == true) {
                element.checked = true                                
            }else{
                element.checked = false
            }
        })
    })

    //filter by channel
    checks1.forEach(element => {
        element.addEventListener("click", async() => {
            allChannels.checked = false
            if (element.checked == true) {
                og.checkedElements.push(element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }else{
                og.checkedElements = og.checkedElements.filter(c => c != element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }
            if (og.checkedElements.length == checks1.length) {
                allChannels.checked = true
            }else{
                allChannels.checked = false
            }
        })
    })

    //close popups event listener
    closePopups.forEach(element => {        
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })

    //table info events listeners
    tableIcons.forEach(element => {

        const info = document.getElementById(element.id.replace('Icon','Info'))

        element.addEventListener("mouseover", async(e) => {
            console.log(info)
            const mouseX = e.clientX
            console.log(mouseX)
            info.style.left = (mouseX - 100) + 'px'
            info.style.display = 'block'
        })

        element.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    
    })

    //accept deliver order
    doppAccept.addEventListener("click", async() => {
        
        const data = {idOrder:og.idOrderToDeliver}

        await fetch(dominio + 'apis/sales/deliver-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dopp.style.display = 'none'

        og.orders = await (await fetch(dominio + 'apis/sales/orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        doppOk.style.display = 'block'

        //hide okPopup after one second
        setTimeout(function() {
            doppOk.style.display = 'none'
        }, 1000)

    })

    //accept cancel order
    coppAccept.addEventListener("click", async() => {
        
        const data = {idOrder:og.idOrderToCancel}

        await fetch(dominio + 'apis/sales/cancel-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        copp.style.display = 'none'

        og.orders = await (await fetch(dominio + 'apis/sales/orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        coppOk.style.display = 'block'

        //hide okPopup after one second
        setTimeout(function() {
            coppOk.style.display = 'none'
        }, 1000)

        

    })
})
