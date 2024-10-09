
let og = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    elementsToPredict:[
        {
            input: filterCustomer,
            list: ulPredictedCustomers,
            apiUrl: 'apis/data/customers/predict-customers/',
            name: 'customer_name',
            elementName: 'customer'
        },
        {
            input: selectProduct,
            list: ulPredictedProducts,
            apiUrl: '',
            name: 'full_description',
            elementName: 'product'
        }
    ],
    season:'',
    customers:[],
    products:[],
    orders:[],
    ordersFiltered:[],
    ordersManagers:[],
    customersSummary:[],
    channelsChecks:[channel_1, channel_2, channel_3, channel_4],
    channelsChecked:[],
    //CREATE ORDER
    productSizes:[],
    selectedSizes:[],
    productColors:[],
    selectedColors:[],
    orderDetails: [],
    orderData: {
        id:'',
        order_number:'',
        id_sales_channels:'',
        id_customers:0,
        subtotal:0,
        discount:0,
        total:0,
        id_orders_status:1,
        observations:''
    },







    
    idOrderToCancel:0,
    idOrderToRestore:0,
    idOrderToDeliver:0,
    idOrderToAssign:0,
    idOrderObservations:0,
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
    colorsOptions:[],
    selectedColors:[],   
    discount:0,
    errorsQty:0,
    customerData:[]

}

export default og