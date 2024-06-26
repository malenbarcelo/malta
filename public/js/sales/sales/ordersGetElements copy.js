import og from "./ordersGlobals.js"

function getElements() {
    
    /*---------------------------orders.ejs (1)---------------------------*/
    const DGAcreateOrder = document.getElementById('DGAcreateOrder')
    const DGAcreateOrderError = document.getElementById('DGAcreateOrderError')
    const filterCustomer = document.getElementById('filterCustomer')
    const filterCustomerLabel = document.getElementById('filterCustomerLabel')
    const filterOrder = document.getElementById('filterOrder')
    const filterOrderManager = document.getElementById('filterOrderManager')
    const filterOrderStatus = document.getElementById('filterOrderStatus')
    const filterPaymentStatus = document.getElementById('filterPaymentStatus')
    const unfilterOrders = document.getElementById('unfilterOrders')    
    const allChannels = document.getElementById('allChannels')
    const Dif_1 = document.getElementById('Dif_1')
    const Dif_2 = document.getElementById('Dif_2')
    const Web_AyR = document.getElementById('Web_AyR')
    const Web_T = document.getElementById('Web_T')
    const selectChannelError = document.getElementById('selectChannelError')
    const bodyOrders = document.getElementById('bodyOrders')
    const ordersLoader = document.getElementById('ordersLoader')
    const eoppIcon = document.getElementById('eoppIcon')
    const rpppIcon = document.getElementById('rpppIcon')
    const doppIcon = document.getElementById('doppIcon')
    const coppIcon = document.getElementById('coppIcon')
    const amppIcon = document.getElementById('amppIcon')
    
    /*----orders.ejs popups-----*/
    //register payment (rppp)
    const rppp = document.getElementById('rppp')
    const rpppTitle = document.getElementById('rpppTitle')
    const rpppSubtotal = document.getElementById('rpppSubtotal')
    const rpppDiscount = document.getElementById('rpppDiscount')
    const rpppTotal = document.getElementById('rpppTotal')
    const rpppPaid = document.getElementById('rpppPaid')
    const rpppBalance = document.getElementById('rpppBalance')
    const rpppBalanceUsed = document.getElementById('rpppBalanceUsed')
    const rpppUseBalance = document.getElementById('rpppUseBalance')
    const rpppUseBalanceCheck = document.getElementById('rpppUseBalanceCheck')
    const rpppUseBalanceLabel = document.getElementById('rpppUseBalanceLabel')
    const rpppPayment = document.getElementById('rpppPayment')
    const rpppPaymentMethod = document.getElementById('rpppPaymentMethod')
    const rpppNewBalance = document.getElementById('rpppNewBalance')
    const rpppBalanceAlert = document.getElementById('rpppBalanceAlert')
    const rpppAccept = document.getElementById('rpppAccept')
    const rpppClose = document.getElementById('rpppClose')
    const rpppCancel = document.getElementById('rpppCancel')
    const rpppOk = document.getElementById('rpppOk')
    og.rpppValidate = [rpppPayment,rpppPaymentMethod]
    og.rpppPaymentInputs = [rpppPayment,rpppUseBalance]

    //create / edit order popup (ceopp)
    const ceopp = document.getElementById('ceopp')

    //deliver order popup (dopp)
    const dopp = document.getElementById('dopp')
    const doppQuestion = document.getElementById('doppQuestion')
    const doppAcceps = document.getElementById('doppAcceps')
    const doppClose = document.getElementById('doppClose')
    const doppCancel = document.getElementById('doppCancel')
    const doppOk = document.getElementById('doppOk')

    //add manager popup (ampp)
    const ampp = document.getElementById('ampp')
    const amppSelectOM = document.getElementById('amppSelectOM')
    const amppAccept = document.getElementById('amppAccept')
    const amppClose = document.getElementById('amppClose')
    const amppCancel = document.getElementById('amppCancel')
    const amppOk = document.getElementById('amppOk')

    //cancel order popup (copp)
    const copp = document.getElementById('copp')
    const coppQuestion = document.getElementById('coppQuestion')
    const coppAcceps = document.getElementById('coppAcceps')
    const coppClose = document.getElementById('coppClose')
    const coppCancel = document.getElementById('coppCancel')
    const coppOk = document.getElementById('coppOk')    
    
    //define arrays with elements
    og.filters1 = [filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    og.checks1 = [Dif_1,Dif_2,Web_AyR,Web_T]

    /*---------------------------ordersCreateEdit.ejs (2)---------------------------*/
    // const createEditPopup = document.getElementById('createEditPopup')
    // const closeCreateEditPopup = document.getElementById('closeCreateEditPopup')
    // const customerOrder = document.getElementById('customerOrder')
    // const selectProduct = document.getElementById('selectProduct')
    // const predictedProductsList = document.getElementById('predictedProductsList')
    // const selectSize = document.getElementById('selectSize')
    // const colorsRow = document.getElementById('colorsRow')
    // const createEditAddProduct = document.getElementById('createEditAddProduct')
    // const errorText1 = document.getElementById('errorText1')
    // const orderInfo = document.getElementById('orderInfo')
    // const bodyCreateEdit = document.getElementById('bodyCreateEdit')
    // const saveOrder = document.getElementById('saveOrder')

    // //define arrays with elements
    // const selects2 = [selectSize]

    /*---------------------------ordersEditPopup.ejs (3)---------------------------*/
    // const editPopup = document.getElementById('editPopup')
    // const titleEditPopup = document.getElementById('titleEditPopup')
    // const acceptEdit = document.getElementById('acceptEdit')
    // const cancelEdit = document.getElementById('cancelEdit')
    // const closeEditPopup = document.getElementById('closeEditPopup')
    // const orderDetailsId = document.getElementById('orderDetailsId')
    // const editPrice = document.getElementById('editPrice')
    // const editQty = document.getElementById('editQty')
    // const errorText2 = document.getElementById('errorText2')

    // //define arrays with elements
    // const inputs3 = [editPrice, editQty]

    /*---------------------------popups close and cancel---------------------------*/
    og.closePopups = [rpppClose,rpppCancel,doppClose,doppCancel,amppClose,amppCancel,coppClose,coppCancel]
    og.tableIcons = [eoppIcon,rpppIcon,doppIcon,amppIcon,coppIcon]
}

export { getElements }