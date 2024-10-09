import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { getData, applyFilters,updateCustomerData,updateOrderData } from "./functions.js"
import { printOrders } from "./printOrders.js"
import { printOrderDetails } from "./printOrderDetails.js"
import { closePopupsEventListeners,clearInputs, showTableInfo, applyPredictElement } from "../../generalFunctions.js"

//popups events listeners
import { coppEventListeners } from "./ordersCOPP.js"
import { ceoppEventListeners } from "./ordersCEOPP.js"
import { epsppEventListeners } from "./ordersEPSPP.js"
import { epcppEventListeners } from "./ordersEPCPP.js"

// import { eodppEventListeners } from "./ordersEODPP.js"
// import { obppEventListeners } from "./ordersOBPP.js"
// import { rcpppEventListeners } from "./ordersRCPPP.js"
// import { rpppEventListeners } from "./ordersRPPP.js"
// import { scppEventListeners } from "./ordersSCPP.js"

window.addEventListener('load',async()=>{

    //get elements
    await getData()

    //popups event listeners
    coppEventListeners() //CANCEL ORDER POPUP
    ceoppEventListeners() //CREATE EDIT ORDER POPUP
    epsppEventListeners() //EDIT PRODUCT SIZES POPUP
    epcppEventListeners() //EDIT PRODUCT COLORS POPUP
    // eodppEventListeners() //EDIT ORDER DETAILS POPUP
    // rpppEventListeners() //REGISTER PAYMENT POPUP
    // rcpppEventListeners() //REGISTER CUSTOMER PAYMENT POPUP
    // obppEventListeners() //OBSERVATIONS POPUP
    // scppEventListeners() //SELECT COLOR POPUP

    //close popups event listener
    const closePopups = [coppClose,coppCancel,epsppClose, epcppClose]
    closePopupsEventListeners(closePopups)

    //close side popup
    ceoppClose.addEventListener("click", async() => {
        ceopp.classList.remove('slideIn')
    })

    //table info events listeners
    const tableIcons = [
        {
            icon:eoppIcon,
            right:'23.5%'
        },
        {
            icon:rpppIcon,
            right:'20.5%'
        },
        {
            icon:pvppIcon,
            right:'17.5%'
        },
        {
            icon:doppIcon,
            right:'14.5%'
        },
        {
            icon:amppIcon,
            right:'12%'
        },
        {
            icon:obppIcon,
            right:'9.5%'
        },
        {
            icon:coppIcon,
            right:'6.5%'
        }
    ]

    showTableInfo(tableIcons,305,150)

    //select channels
    og.channelsChecks.forEach(element => {
        element.addEventListener("click", async() => {
            if (element.checked == true) {
                og.channelsChecked.push(element)
                applyFilters()
                printOrders()
            }else{
                og.channelsChecked = og.channelsChecked.filter(c => c != element)
                applyFilters()
                printOrders()
            }
            selectChannelError.style.display = 'none'
        })
    })

    //predicts elements
    applyPredictElement(og.elementsToPredict)

    //filters event listeners
    const filters = [showCanceled,filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printOrders()
        })
    })

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        clearInputs(filters)
        
        og.channelsChecks.forEach(element => {
            element.checked = false
        })

        og.channelsChecked = []
        printOrders()
        updateCustomerData()
        DGAregisterPayment.classList.add('notVisible')
        DGAmovementsDetails.classList.add('notVisible')
    })

    //filters customer error
    filterCustomer.addEventListener("change", async() => {
        const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
        if (findCustomer.length > 0) {
            //DGA errors
            filterCustomerLabel.classList.remove('errorColor')
            filterCustomer.classList.remove('isInvalid')
            DGAcreateOrderError.style.display = 'none'
            DGAregisterPayment.classList.remove('notVisible')
            DGAmovementsDetails.classList.remove('notVisible')

            updateCustomerData()
        }else{
            DGAregisterPayment.classList.add('notVisible')
            DGAmovementsDetails.classList.add('notVisible')
        }
    })

    //create order
    DGAcreateOrder.addEventListener("click", async() => {
        const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
        if (filterCustomer.value == '' || findCustomer.length == 0) {
            filterCustomerLabel.classList.add('errorColor')
            filterCustomer.classList.add('isInvalid')
            DGAordersErrors.style.display = 'flex'
            DGAcreateOrderError.style.display = 'block'
        }

        if (og.channelsChecked.length == 0 || (og.channelsChecked.length > 1 || (og.channelsChecked[0].id !='channel_1' && og.channelsChecked[0].id !='channel_2'))) {
            DGAordersErrors.style.display = 'flex'
            selectChannelError.style.display = 'block'
        }

        if (filterCustomer.value != '' && !(og.channelsChecked.length == 0 || (og.channelsChecked.length > 1 || (og.channelsChecked[0].id !='channel_1' && og.channelsChecked[0].id !='channel_2')))) {

            //clear data
            og.orderDetails = []
            printOrderDetails()

            //complete popup info
            const salesChannel = channel_1.checked ? 1 : 2
            const customer = filterCustomer.value
            const orderNumber = await (await fetch(dominio + 'apis/sales/new-order')).json()
            const customerData = og.customers.filter(c => c.customer_name == customer)[0]
            og.discount = customerData.discount
            const idCustomers = customerData.id
            og.orderData.discount = parseFloat(og.discount,2)
            og.orderData.subtotal = 0
            og.orderData.total = 0
            og.orderData.id_customers = idCustomers
            og.orderData.id_sales_channels = salesChannel
            og.orderData.order_number = orderNumber
            og.orderData.id = 'NA'
            ceoppSave.style.display = 'none'
            ceoppCreate.style.display = 'flex'
            ceoppTitle.innerText = 'CREAR PEDIDO'
            updateOrderData()
            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        }
    })


















    // //accept deliver order
    // doppAccept.addEventListener("click", async() => {

    //     const data = {idOrder:og.idOrderToDeliver}

    //     await fetch(dominio + 'apis/sales/deliver-order',{
    //         method:'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })

    //     dopp.style.display = 'none'

    //     og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    //     filterOrders()
    //     printTableOrders(og.ordersFiltered)

    //     showOkPopup(doppOk)

    // })

    // //accept assign order manager
    // amppAccept.addEventListener("click", async() => {

    //     const data = {
    //         idOrder:og.idOrderToAssign,
    //         orderManagerId:amppSelectOM.value
    //     }

    //     await fetch(dominio + 'apis/sales/assign-order-manager',{
    //         method:'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })

    //     ampp.style.display = 'none'

    //     og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    //     filterOrders()
    //     printTableOrders(og.ordersFiltered)

    //     showOkPopup(amppOk)

    // })

    // //accept restore order
    // roppAccept.addEventListener("click", async() => {

    //     const data = {idOrder:og.idOrderToRestore}

    //     await fetch(dominio + 'apis/sales/restore-order',{
    //         method:'POST',
    //         headers: {'Content-Type': 'application/json'},
    //         body: JSON.stringify(data)
    //     })

    //     ropp.style.display = 'none'

    //     og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    //     filterOrders()
    //     printTableOrders(og.ordersFiltered)

    //     showOkPopup(roppOk)

    // })

    

    // //register customer payment
    // DGAregisterPayment.addEventListener("click", async() => {
    //     const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
    //     if (filterCustomer.value == '' || findCustomer.length == 0) {
    //         filterCustomerLabel.classList.add('errorColor')
    //         filterCustomer.classList.add('isInvalid')
    //         DGAordersErrors.style.display = 'flex'
    //         DGAcreateOrderError.style.display = 'block'
    //         selectChannelError.style.display = 'none'
    //     }else{
    //         rcpppSubtitle.innerText = og.customerData[0].customer_name
    //         clearInputs([rcpppType,rcpppPaymentMethod,rcpppAmount])
    //         selectChannelError.style.display = 'none'
    //         rcppp.style.display = 'block'

    //     }
    // })

    // //view customer movements
    // DGAmovementsDetails.addEventListener("click", async() => {
    //     const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
    //     const customerMovements = await (await fetch(dominio + 'apis/sales/customers/customer-movements/' + findCustomer[0].id)).json()
    //     cmppSubtitle.innerText = findCustomer[0].customer_name
    //     printCustomerMovements(customerMovements)
    //     selectChannelError.style.display = 'none'
    //     cmpp.style.display = 'block'
    // })

    // //customer notes
    // const notes = document.getElementById('notes')
    // notes.addEventListener("click", async() => {
    //     og.notesFrom = 'customers'
    //     obppTitle.innerText = og.customerData[0].customer_name + ' - OBSERVACIONES'
    //     obppObs.innerText = og.customerData[0].notes
    //     obpp.style.display = 'block'
    // })

    // acceptWithEnter(obppObs,obppAccept)
})
