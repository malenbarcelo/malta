import og from "./ordersGlobals.js"

function getElements() {
    
    /*---------------------------orders.ejs (1)---------------------------*/    
    const filterCustomer = document.getElementById('filterCustomer')
    const filterOrder = document.getElementById('filterOrder')
    const filterOrderManager = document.getElementById('filterOrderManager')
    const filterOrderStatus = document.getElementById('filterOrderStatus')
    const filterPaymentStatus = document.getElementById('filterPaymentStatus')
    const Dif1 = document.getElementById('Dif1')
    const Dif2 = document.getElementById('Dif2')
    const WebAyR = document.getElementById('WebAyR')
    const WebT = document.getElementById('WebT')
    const eoppIcon = document.getElementById('eoppIcon')
    const rpppIcon = document.getElementById('rpppIcon')
    const doppIcon = document.getElementById('doppIcon')
    const coppIcon = document.getElementById('coppIcon')
    const amppIcon = document.getElementById('amppIcon')
    
    /*----orders.ejs popups-----*/
    //create / edit order popup (ceopp)
    const ceoppClose = document.getElementById('ceoppClose')
    const color0 = document.getElementById('color0')
    const color1 = document.getElementById('color1')
    const color2 = document.getElementById('color2')
    const color3 = document.getElementById('color3')
    const color4 = document.getElementById('color4')
    const color5 = document.getElementById('color5')
    const color6 = document.getElementById('color6')
    const color7 = document.getElementById('color7')

    //register payment (rppp)
    og.rpppValidate = [rpppPayment,rpppPaymentMethod]
    og.rpppPaymentInputs = [rpppPayment,rpppUseBalance]
    
    //DEFINE ARRAYS WITH ELEMENTS    
    //filters
    og.filters1 = [filterCustomer,filterOrder,filterOrderManager,filterOrderStatus,filterPaymentStatus]

    //checks
    og.checks1 = [channel_1,channel_2,channel_3,channel_4]

    //close and cancel
    og.closePopups = [rpppClose,rpppCancel,doppClose,doppCancel,amppClose,amppCancel,coppClose,coppCancel,cdppClose,cdppCancel,eodppClose,eodppCancel]
    og.closeSidePopups = [ceoppClose]

    //table icons
    og.tableIcons = [eoppIcon,rpppIcon,doppIcon,amppIcon,coppIcon]

    //inputs
    og.ceoppColorInputs = [color0,color1,color2,color3,color4,color5,color6,color7]
}

export { getElements }