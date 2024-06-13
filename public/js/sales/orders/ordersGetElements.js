function getElements() {
    
    /*---------------------------orders.ejs (1)---------------------------*/
    const createEditOrder = document.getElementById('createEditOrder')
    const filterCustomer = document.getElementById('filterCustomer')
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
    const bodyOrders = document.getElementById('bodyOrders')
    const ordersLoader = document.getElementById('ordersLoader')
    const eoppIcon = document.getElementById('eoppIcon')
    const rpppIcon = document.getElementById('rpppIcon')
    const doppIcon = document.getElementById('doppIcon')
    const coppIcon = document.getElementById('coppIcon')
    const amppIcon = document.getElementById('amppIcon')
    
    /*----orders.ejs popups-----*/
    //deliver order popup (dopp)
    const dopp = document.getElementById('dopp')
    const doppQuestion = document.getElementById('doppQuestion')
    const doppAcceps = document.getElementById('doppAcceps')
    const doppClose = document.getElementById('doppClose')
    const doppCancel = document.getElementById('doppCancel')
    const doppOk = document.getElementById('doppOk')
    //add manager popup (ampp)
    //cancel order popup (copp)
    const copp = document.getElementById('copp')
    const coppQuestion = document.getElementById('coppQuestion')
    const coppAcceps = document.getElementById('coppAcceps')
    const coppClose = document.getElementById('coppClose')
    const coppCancel = document.getElementById('coppCancel')
    const coppOk = document.getElementById('coppOk')    
    
    //define arrays with elements
    const filters1 = [filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]
    const checks1 = [Dif_1,Dif_2,Web_AyR,Web_T]

    /*---------------------------ordersCreateEdit.ejs (2)---------------------------*/
    const createEditPopup = document.getElementById('createEditPopup')
    const closeCreateEditPopup = document.getElementById('closeCreateEditPopup')
    const customerOrder = document.getElementById('customerOrder')
    const selectProduct = document.getElementById('selectProduct')
    const predictedProductsList = document.getElementById('predictedProductsList')
    const selectSize = document.getElementById('selectSize')
    const colorsRow = document.getElementById('colorsRow')
    const createEditAddProduct = document.getElementById('createEditAddProduct')
    const errorText1 = document.getElementById('errorText1')
    const orderInfo = document.getElementById('orderInfo')
    const bodyCreateEdit = document.getElementById('bodyCreateEdit')
    const saveOrder = document.getElementById('saveOrder')

    //define arrays with elements
    const selects2 = [selectSize]

    /*---------------------------ordersEditPopup.ejs (3)---------------------------*/
    const editPopup = document.getElementById('editPopup')
    const titleEditPopup = document.getElementById('titleEditPopup')
    const acceptEdit = document.getElementById('acceptEdit')
    const cancelEdit = document.getElementById('cancelEdit')
    const closeEditPopup = document.getElementById('closeEditPopup')
    const orderDetailsId = document.getElementById('orderDetailsId')
    const editPrice = document.getElementById('editPrice')
    const editQty = document.getElementById('editQty')
    const errorText2 = document.getElementById('errorText2')

    //define arrays with elements
    const inputs3 = [editPrice, editQty]

    /*---------------------------popups close and cancel---------------------------*/
    const closePopups = [doppClose,doppCancel,coppClose,coppCancel]
    const tableIcons = [eoppIcon,rpppIcon,doppIcon,amppIcon,coppIcon]    
    
    return {filters1,checks1,selects2,inputs3,closePopups,tableIcons}
}

export { getElements }