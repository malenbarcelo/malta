import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { getData, applyFilters,updateCustomerData,updateOrderData, printCustomerMovements } from "./functions.js"
import { printOrders } from "./printOrders.js"
import { printOrderDetails } from "./printOrderDetails.js"
import { closePopups,clearInputs, showTableInfo, applyPredictElement, closeWithEscape, acceptWithEnterInput, acceptWithEnterPopup,dateToString, focusInputs } from "../../generalFunctions.js"

//popups events listeners
import { caoppEventListeners } from "./ordersCAOPP.js"
import { ceoppEventListeners } from "./ordersCEOPP.js"
import { epsppEventListeners } from "./ordersEPSPP.js"
import { epcppEventListeners } from "./ordersEPCPP.js"
import { chdppEventListeners } from "./ordersCHDPP.js"
import { eodppEventListeners } from "./ordersEODPP.js"
import { oloppEventListeners } from "./ordersOLOPP.js"
import { amppEventListeners } from "./ordersAMPP.js"
import { obppEventListeners } from "./ordersOBPP.js"
// import { doppEventListeners } from "./ordersDOPP.js"
import { roppEventListeners } from "./ordersROPP.js"
import { rpppEventListeners } from "./ordersRPPP.js"
import { rcpppEventListeners } from "./ordersRCPPP.js"
import { cpmppEventListeners } from "./ordersCPMPP.js"
import { cpppEventListeners } from "./ordersCPPP.js"
import { esppEventListeners } from "./ordersESPP.js"
import { ecppEventListeners } from "./ordersECPP.js"
import { cdppEventListeners } from "./ordersCDPP.js"
import { cbppEventListeners } from "./ordersCBPP.js"
import {schppEventListeners } from "./ordersSCHPP.js"

window.addEventListener('load',async()=>{

    ordersLoader.style.display = 'block'

    //get data
    await getData()

    //select order manager
    if (og.userLogged == 'Esteban') {
        filterOrderManager.value = 4
        channel_2.checked = true
        og.channelsChecked.push(channel_2)
    }
    if (og.userLogged == 'Pedro') {
        filterOrderManager.value = 5
        og.channelsChecked.push(channel_1)
        channel_1.checked = true
    }

    //apply filters
    applyFilters()

    //print orders
    printOrders()

    //popups event listeners
    caoppEventListeners() //CANCEL ORDER POPUP
    ceoppEventListeners() //CREATE EDIT ORDER POPUP
    epsppEventListeners() //EDIT PRODUCT SIZES POPUP
    epcppEventListeners() //EDIT PRODUCT COLORS POPUP
    chdppEventListeners() //CHANGE DISCOUNT POPUP
    eodppEventListeners() //EDIT ORDER DETAILS POPUP
    oloppEventListeners() //ORDERS LINE OBSERVATIONS POPUP
    amppEventListeners() //ASSIGN MANAGER POPUP
    obppEventListeners() //OBSERVATIONS POPUP
    // doppEventListeners() //DELIVER ORDER POPUP
    roppEventListeners() //RESTORE ORDER POPUP
    rpppEventListeners() //REGISTER PAYMENT POPUP
    rcpppEventListeners() //REGISTER CUSTOMER PAYMENT POPUP
    cpmppEventListeners() //CREATE PAYMET METHOD POPUP
    cpppEventListeners() //CREATE PRODUCT POPUP
    esppEventListeners() //EDIT SIZES POPUP (from create product)
    ecppEventListeners() //EDIT COLORS POPUP (from create product)
    cdppEventListeners() //CREATE DATA POPUP (from create data)
    cbppEventListeners() //CUSTOMER BALANCE POPUP
    schppEventListeners() //SAVE CHANGES POPUP

    //close popups event listener
    const popupsToClose = og.popups.filter( p => p.id != 'ceopp')
    closePopups(popupsToClose)

    //close with escape
    closeWithEscape(popupsToClose)

    //accept with enter inputs
    acceptWithEnterInput(ceoppReqQty,ceoppAddItem) //add product
    acceptWithEnterInput(ceoppConfQty,ceoppAddItem) //add product
    acceptWithEnterInput(chdppNewDiscount,chdppAccept) //add product
    acceptWithEnterInput(eodppPrice,eodppAccept) //edit order line
    acceptWithEnterInput(eodppQtyR,eodppAccept) //edit order line
    acceptWithEnterInput(eodppQtyC,eodppAccept) //edit order line        

    //accept with enter popups
    acceptWithEnterPopup(caopp,caoppAccept) //cancel order
    acceptWithEnterPopup(ropp,roppAccept) //restore order
    acceptWithEnterPopup(schpp,schppAccept) //save changes
    //acceptWithEnterPopup(aeppp,aepppAccept) //add existing product
    
    //table info events listeners
    showTableInfo(og.tableIcons,310,150)

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
        })
    })

    //filters event listeners
    const filters = [showCanceled,filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printOrders()
        })
    })

    //focus filters
    const filtersToFocus = [filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    focusInputs(filtersToFocus)    

    //unfilter event listener
    unfilterOrders.addEventListener("click", async() => {
        og.ordersFiltered = og.orders
        clearInputs(filters)
        
        og.channelsChecks.forEach(element => {
            element.checked = false
        })

        og.channelsChecked = []
        applyFilters()
        printOrders()
        updateCustomerData()
        DGAcreateOrderError.style.display = 'none'
        selectChannelError.style.display = 'none'
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
            DGAbalance.classList.remove('notVisible')

            updateCustomerData()
        }else{
            DGAregisterPayment.classList.add('notVisible')
            DGAmovementsDetails.classList.add('notVisible')
            DGAbalance.classList.add('notVisible')
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
            clearInputs([selectProduct, ceoppReqQty, ceoppConfQty])
            ceoppAddError.style.display = 'none'

            //complete popup info
            const salesChannel = channel_1.checked ? 1 : 2
            const customer = filterCustomer.value
            const orderNumber = await (await fetch(dominio + 'apis/sales/new-order')).json()
            const customerData = og.customers.filter(c => c.customer_name == customer)[0]
            og.discount = customerData.discount
            const idCustomers = customerData.id
            og.orderData.season = og.season.season
            og.orderData.discount = parseFloat(og.discount,2)
            og.orderData.subtotal = 0
            og.orderData.total = 0
            ceoppAttributes.style.display = 'none'
            og.orderData.id_customers = idCustomers
            og.orderData.id_sales_channels = salesChannel
            og.orderData.order_number = orderNumber
            og.orderData.id = 'NA'
            ceoppEdit.style.display = 'none'
            ceoppCreate.style.display = 'flex'
            ceoppTitle.innerText = 'CREAR PEDIDO'
            og.action = 'create'
            updateOrderData()
            customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

            //show popup
            ceopp.classList.add('slideIn')
        }
    })

    //customer notes
    const notes = document.getElementById('notes')
    notes.addEventListener("click", async() => {
        og.notesFrom = 'customers'
        obppTitle.innerText = og.customerData[0].customer_name + ' - OBSERVACIONES'
        obppObs.innerText = og.customerData[0].notes
        obpp.style.display = 'block'
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
    
    //view customer balance
    DGAbalance.addEventListener("click", async() => {

        cbppBody.innerHTML = ''
        clearInputs([cbppSubtotal, cbppDiscount, cbppTotal, cbppPaid, cbppBalance])
        cbppIncompleteOrder.style.display = 'none'
        cbppDeliveredOrder.style.display = 'none'
        
        //customer orders
        og.customerOrders = og.orders.filter(o => o.orders_customers.customer_name == filterCustomer.value && o.id_payments_status != 5 && o.enabled == 1)
        
        //complete select
        if (og.customerOrders.length == 1) {
            cbppOrder.innerHTML = '<option value="' + og.customerOrders[0].id + '">#' + og.customerOrders[0].order_number.toString().padStart(5, '0') + ' (' + dateToString(og.customerOrders[0].date) + ')</option>'
            
            setTimeout(() => {
                const event = new Event('change')
                cbppOrder.dispatchEvent(event)
            }, 10)
            
        }else{
            cbppOrder.innerHTML = '<option value=""></option>'
            og.customerOrders.forEach(order => {
                cbppOrder.innerHTML += '<option value="' + order.id + '">#' + order.order_number.toString().padStart(5, '0') + ' (' + dateToString(order.date) + ')</option>'
            })
        }

        cbppTitle.innerText = filterCustomer.value.toUpperCase()
        selectChannelError.style.display = 'none'
        cbppPrintPdf.style.display = 'none'
        cbpp.style.display = 'block'
    })  
})
