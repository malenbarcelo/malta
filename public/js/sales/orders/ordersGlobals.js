
let og = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    filters1:[],
    checks1:[],
    closePopups:[],
    closeSidePopups:[],
    tableIcons:[],
    customers:[],
    products:[],
    orders:[],
    ordersPayments:[],
    ordersManagers:[],
    ordersFiltered:[],
    checkedElements:[],
    idOrderToCancel:0,
    idOrderToRestore:0,
    idOrderToDeliver:0,
    idOrderToAssign:0,
    idOrderDetailsToEdit:0,
    orderToPay:[],
    orderToPayNewBalance:0,
    orderToPayCustomerBalance:0,
    orderToPayPayment:{
        payment:0,
        balanceUsed:0
    },
    rpppValidate:[],
    rpppPaymentInputs:[],
    orderData: {
        order_number:'',
        id_sales_channels:'',
        id_customers:0,
        subtotal:0,
        discount:0,
        total:0,
        id_orders_status:1,
        observations:''
    },
    orderDetails: [],
    colorsOptions:[],
    selectedColors:[],   
    discount:0,
    errorsQty:0,
    predictedProducts:[],
    productFocused:-1,
    elementToFocus:'',
    elementToUnfocus:'',

}

export default og