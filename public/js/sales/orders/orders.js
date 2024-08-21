import { dominio } from "../../dominio.js"
import og from "./ordersGlobals.js"
import g from "../../globals.js"
import { getElements } from "./ordersGetElements.js"
import { printTableOrders, filterOrders, updateOrderData, printColorsOptions, printTableCreateEdit,changeSizesOptions} from "./ordersFunctions.js"
import { updateCustomerData } from "./functions.js"
import { printCustomerMovements } from "./printTables.js"
import { clearInputs, inputsValidation, isValid, showOkPopup, predictElements,selectFocusedElement, acceptWithEnter,selectWithClick,showTableInfo} from "../../generalFunctions.js"

//popups events listeners
import { ceoppEventListeners } from "./ordersCEOPP.js"
import { eodppEventListeners } from "./ordersEODPP.js"
import { obppEventListeners } from "./ordersOBPP.js"
import { rcpppEventListeners } from "./ordersRCPPP.js"
import { rpppEventListeners } from "./ordersRPPP.js"
import { scppEventListeners } from "./ordersSCPP.js"

window.addEventListener('load',async()=>{

    //get elements
    getElements()

    //get data and complete globals
    og.customers = await (await fetch(dominio + 'apis/data/customers')).json()
    og.products = await (await fetch(dominio + 'apis/data/products')).json()
    og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
    og.ordersManagers = await (await fetch(dominio + 'apis/data/orders-managers')).json()
    og.customersSummary = await (await fetch(dominio + 'apis/sales/customers/customers-summary')).json()
    og.ordersFiltered = og.orders

    //print table
    printTableOrders(og.orders)

    //POPUPS EVENTS LISTENERS
    ceoppEventListeners() //CREATE EDIT ORDER POPUP
    eodppEventListeners() //EDIT ORDER DETAILS POPUP
    rpppEventListeners() //REGISTER PAYMENT POPUP
    rcpppEventListeners() //REGISTER CUSTOMER PAYMENT POPUP
    obppEventListeners() //OBSERVATIONS POPUP
    scppEventListeners() //SELECT COLOR POPUP

    //showCanceled
    showCanceled.addEventListener("click", async() => {
        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)
    })

    //filters event listeners
    og.filters1.forEach(filter => {
        filter.addEventListener("change", async() => {
            filterOrders()
            printTableOrders(og.ordersFiltered)
        })
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

    //filter customer event listener - predict elements
    filterCustomer.addEventListener("input", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const apiUrl = 'apis/data/customers/predict-customers/'
        const name = 'customer_name'
        const elementName = 'customer'
        predictElements(input,list,apiUrl,name,elementName)
    })

    filterCustomer.addEventListener("keydown", async(e) => {
        const input = filterCustomer
        const list = ulPredictedCustomers
        const elementName = 'customer'
        selectFocusedElement(e,input,list,elementName)
    })

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        filterCustomer.value = ''
        filterOrder.value = 'default'
        filterOrderManager.value = 'default'
        filterOrderStatus.value = 'default'
        filterPaymentStatus.value = 'default'
        og.checks1.forEach(element => {
            element.checked = false
        })
        og.checkedElements = []
        printTableOrders(og.ordersFiltered)
        updateCustomerData()
        DGAregisterPayment.classList.add('notVisible')
        DGAmovementsDetails.classList.add('notVisible')
    })

    //filter by channel
    og.checks1.forEach(element => {
        element.addEventListener("click", async() => {
            if (element.checked == true) {
                og.checkedElements.push(element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }else{
                og.checkedElements = og.checkedElements.filter(c => c != element)
                filterOrders()
                printTableOrders(og.ordersFiltered)
            }
            selectChannelError.style.display = 'none'
        })
    })

    //close popups event listener
    const closePopups = [rpppClose,rpppCancel,doppClose,doppCancel,amppClose,amppCancel,coppClose,coppCancel,roppClose,roppCancel,cdppClose,cdppCancel,eodppClose,eodppCancel,scppCancel,scppClose,obppClose,rcpppClose, rcpppCancel,cmppClose]
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'

            //select color popup exception
            if (element.id == 'scppCancel' || element.id == 'scppClose') {
                selectProduct.value = ''
                selectSize.innerHTML = '<option value="default" id="selectSizeDefault"></option>'            
            }
        })
    })

    //close side popups event listener
    og.closeSidePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.classList.remove('slideIn')
        })
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

    //accept deliver order
    doppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToDeliver}

        await fetch(dominio + 'apis/sales/deliver-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        dopp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(doppOk)

    })

    //accept assign order manager
    amppAccept.addEventListener("click", async() => {

        const data = {
            idOrder:og.idOrderToAssign,
            orderManagerId:amppSelectOM.value
        }

        await fetch(dominio + 'apis/sales/assign-order-manager',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ampp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(amppOk)

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

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(coppOk)

    })

    //accept restore order
    roppAccept.addEventListener("click", async() => {

        const data = {idOrder:og.idOrderToRestore}

        await fetch(dominio + 'apis/sales/restore-order',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        ropp.style.display = 'none'

        og.orders = showCanceled.checked ? await (await fetch(dominio + 'apis/sales/in-progress-orders/show-canceled')).json() : await (await fetch(dominio + 'apis/sales/in-progress-orders')).json()
        filterOrders()
        printTableOrders(og.ordersFiltered)

        showOkPopup(roppOk)

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

        if (og.checkedElements.length == 0 || (og.checkedElements.length > 1 || (og.checkedElements[0].id !='channel_1' && og.checkedElements[0].id !='channel_2'))) {
            DGAordersErrors.style.display = 'flex'
            selectChannelError.style.display = 'block'
        }

        if (filterCustomer.value != '' && !(og.checkedElements.length == 0 || (og.checkedElements.length > 1 || (og.checkedElements[0].id !='channel_1' && og.checkedElements[0].id !='channel_2')))) {

            //clear data
            og.orderDetails = []
            printTableCreateEdit(og.orderDetails)

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
            og.action = 'create'
            ceoppTitle.innerText = 'CREAR PEDIDO'

            updateOrderData()

            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        }
    })

    //register customer payment
    DGAregisterPayment.addEventListener("click", async() => {
        const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
        if (filterCustomer.value == '' || findCustomer.length == 0) {
            filterCustomerLabel.classList.add('errorColor')
            filterCustomer.classList.add('isInvalid')
            DGAordersErrors.style.display = 'flex'
            DGAcreateOrderError.style.display = 'block'
            selectChannelError.style.display = 'none'
        }else{
            rcpppSubtitle.innerText = og.customerData[0].customer_name
            clearInputs([rcpppType,rcpppPaymentMethod,rcpppAmount])
            selectChannelError.style.display = 'none'
            rcppp.style.display = 'block'

        }
    })

    //view customer movements
    DGAmovementsDetails.addEventListener("click", async() => {
        const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
        const customerMovements = await (await fetch(dominio + 'apis/sales/customers/customer-movements/' + findCustomer[0].id)).json()
        cmppSubtitle.innerText = findCustomer[0].customer_name
        printCustomerMovements(customerMovements)
        selectChannelError.style.display = 'none'
        cmpp.style.display = 'block'
    })

    //customer notes
    const notes = document.getElementById('notes')
    notes.addEventListener("click", async() => {
        og.notesFrom = 'customers'
        obppTitle.innerText = og.customerData[0].customer_name + ' - OBSERVACIONES'
        obppObs.innerText = og.customerData[0].notes
        obpp.style.display = 'block'
    })

    acceptWithEnter(obppObs,obppAccept)
})
