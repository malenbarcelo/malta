
let og = {
    customers:[],
    products:[],
    orders:[],
    ordersFiltered:[],
    checkedElements:[],
    idOrderToCancel:0,
    idOrderToDeliver:0,
    orderData: {
        order_number:'',
        sales_channel:'',
        id_customers:0,
        subtotal:0,
        discount:0,
        total:0,
        balance:0,
        status:'Agregar',
        order_manager:'',
        observations:''
    },
    orderDetails: [],
    discount:0,
    errorsQty:0,
    predictedProducts:[],
    productFocused:-1,
    elementToFocus:'',
    elementToUnfocus:'',

}

export default og