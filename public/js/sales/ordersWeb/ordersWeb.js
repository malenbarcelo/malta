// import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { getData, applyFilters } from "./functions.js"
import { printTable } from "./printTable.js"
// import { printOrderDetails } from "./printOrderDetails.js"
import { closePopups,clearInputs, showTableInfo, applyPredictElement, closeWithEscape, acceptWithEnterInput, acceptWithEnterPopup,dateToString } from "../../generalFunctions.js"

// //popups events listeners
// import { caoppEventListeners } from "./ordersCAOPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    //get data
    await getData()

    //apply filters
    applyFilters()

    //print orders
    printTable()

    // //popups event listeners
    // caoppEventListeners() //CANCEL ORDER POPUP

    // //close popups event listener
    // closePopups(og.popups)

    // //close with escape
    // const popupsToClose = og.popups.filter( p => p.id != 'ceopp')
    // closeWithEscape(popupsToClose)

    // //accept with enter inputs
    // acceptWithEnterInput(ceoppReqQty,ceoppAddItem) //add product  

    // //accept with enter popups
    // acceptWithEnterPopup(caopp,caoppAccept) //cancel order
    
    // //table info events listeners
    // showTableInfo(og.tableIcons,310,150)

    //predicts elements
    applyPredictElement(g.elementsToPredict)

    //filters event listeners
    const filters = [customer, orderNumber, orderStatus, paymentStatus, salesChannel]
    filters.forEach(filter => {
        filter.addEventListener("change", async() => {
            applyFilters()
            printTable()
        })
    })

    

    //unfilter event listener
    // unfilterOrders.addEventListener("click", async() => {
    //     g.ordersFiltered = g.orders
    //     clearInputs(filters)
        
    //     og.channelsChecks.forEach(element => {
    //         element.checked = false
    //     })

    //     og.channelsChecked = []
    //     applyFilters()
    //     printOrders()
    //     updateCustomerData()
    //     DGAcreateOrderError.style.display = 'none'
    //     selectChannelError.style.display = 'none'
    //     DGAregisterPayment.classList.add('notVisible')
    //     DGAmovementsDetails.classList.add('notVisible')
    // })

    // //filters customer error
    // filterCustomer.addEventListener("change", async() => {
    //     const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
    //     if (findCustomer.length > 0) {
    //         //DGA errors
    //         filterCustomerLabel.classList.remove('errorColor')
    //         filterCustomer.classList.remove('isInvalid')
    //         DGAcreateOrderError.style.display = 'none'
    //         DGAregisterPayment.classList.remove('notVisible')
    //         DGAmovementsDetails.classList.remove('notVisible')
    //         DGAbalance.classList.remove('notVisible')

    //         updateCustomerData()
    //     }else{
    //         DGAregisterPayment.classList.add('notVisible')
    //         DGAmovementsDetails.classList.add('notVisible')
    //         DGAbalance.classList.add('notVisible')
    //     }
    // })

    // //create order
    // DGAcreateOrder.addEventListener("click", async() => {
    //     const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
    //     if (filterCustomer.value == '' || findCustomer.length == 0) {
    //         filterCustomerLabel.classList.add('errorColor')
    //         filterCustomer.classList.add('isInvalid')
    //         DGAordersErrors.style.display = 'flex'
    //         DGAcreateOrderError.style.display = 'block'
    //     }

    //     if (og.channelsChecked.length == 0 || (og.channelsChecked.length > 1 || (og.channelsChecked[0].id !='channel_1' && og.channelsChecked[0].id !='channel_2'))) {
    //         DGAordersErrors.style.display = 'flex'
    //         selectChannelError.style.display = 'block'
    //     }

    //     if (filterCustomer.value != '' && !(og.channelsChecked.length == 0 || (og.channelsChecked.length > 1 || (og.channelsChecked[0].id !='channel_1' && og.channelsChecked[0].id !='channel_2')))) {

    //         //clear data
    //         og.orderDetails = []
    //         printOrderDetails()
    //         clearInputs([selectProduct, ceoppReqQty, ceoppConfQty])
    //         ceoppAddError.style.display = 'none'

    //         //complete popup info
    //         const salesChannel = channel_1.checked ? 1 : 2
    //         const customer = filterCustomer.value
    //         const orderNumber = await (await fetch(dominio + 'apis/sales/new-order')).json()
    //         const customerData = og.customers.filter(c => c.customer_name == customer)[0]
    //         og.discount = customerData.discount
    //         const idCustomers = customerData.id
    //         og.orderData.season = og.season.season
    //         og.orderData.discount = parseFloat(og.discount,2)
    //         og.orderData.subtotal = 0
    //         og.orderData.total = 0
    //         ceoppAttributes.style.display = 'none'
    //         og.orderData.id_customers = idCustomers
    //         og.orderData.id_sales_channels = salesChannel
    //         og.orderData.order_number = orderNumber
    //         og.orderData.id = 'NA'
    //         ceoppEdit.style.display = 'none'
    //         ceoppCreate.style.display = 'flex'
    //         ceoppTitle.innerText = 'CREAR PEDIDO'
    //         og.action = 'create'
    //         updateOrderData()
    //         customerOrder.innerText = customer + ' - Pedido N° ' + orderNumber

    //         //show popup
    //         ceopp.classList.add('slideIn')
    //     }
    // })

    // //customer notes
    // const notes = document.getElementById('notes')
    // notes.addEventListener("click", async() => {
    //     og.notesFrom = 'customers'
    //     obppTitle.innerText = og.customerData[0].customer_name + ' - OBSERVACIONES'
    //     obppObs.innerText = og.customerData[0].notes
    //     obpp.style.display = 'block'
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
    
    // //view customer balance
    // DGAbalance.addEventListener("click", async() => {

    //     cbppBody.innerHTML = ''
    //     clearInputs([cbppSubtotal, cbppDiscount, cbppTotal, cbppPaid, cbppBalance])
        
    //     //customer orders
    //     og.customerOrders = og.orders.filter(o => o.orders_customers.customer_name == filterCustomer.value)
        
    //     //complete select
    //     if (og.customerOrders.length == 1) {
    //         cbppOrder.innerHTML = '<option value="' + og.customerOrders[0].id + '">#' + og.customerOrders[0].order_number.toString().padStart(5, '0') + ' (' + dateToString(og.customerOrders[0].date) + ')</option>'
    //         const event = new Event('change')
    //         cbppOrder.dispatchEvent(event)
    //     }else{
    //         cbppOrder.innerHTML = '<option value=""></option>'
    //         og.customerOrders.forEach(order => {
    //             cbppOrder.innerHTML += '<option value="' + order.id + '">#' + order.order_number.toString().padStart(5, '0') + ' (' + dateToString(order.date) + ')</option>'
    //         })
    //     }

    //     cbppTitle.innerText = filterCustomer.value
    //     selectChannelError.style.display = 'none'
    //     cbpp.style.display = 'block'
    // })  
})
