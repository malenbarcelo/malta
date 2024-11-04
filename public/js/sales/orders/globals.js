
let og = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    tableIcons: [
        {
            icon:eoppIcon,
            right:'16%'
        },
        {
            icon:rpppIcon,
            right:'13.5%'
        },
        {
            icon:pvppIcon,
            right:'10.5%'
        },
        {
            icon:doppIcon,
            right:'7.5%'
        },
        {
            icon:amppIcon,
            right:'5%'
        },
        {
            icon:obppIcon,
            right:'2.5%'
        },
        {
            icon:coppIcon,
            right:'-0.5%'
        }
    ],
    popups:[cdpp,espp,ecpp,cppp,cpmpp,copp,epspp,epcpp,chdpp,eodpp,olopp,ampp,obpp,dopp,ropp,rcppp,rppp,cmpp,ceopp],
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
        },
        {
            input: cpppFabric,
            list: cpppPredictedFabrics,
            apiUrl: 'apis/cuttings/data/predict-fabrics/',
            name: 'fabric',
            elementName: 'fabric'
        },
        {
            input: cpppType,
            list: cpppPredictedTypes,
            apiUrl: 'apis/cuttings/data/predict-products-types/',
            name: 'product_type',
            elementName: 'productType'
        },
    ],
    season:'',
    userLogged:'',
    customers:[],
    products:[],
    orders:[],
    ordersFiltered:[],
    ordersManagers:[],
    paymentMethods:[],
    customersSummary:[],
    channelsChecks:[channel_1, channel_2, channel_3, channel_4],
    channelsChecked:[],
    //CREATE PRODUCT
    sizes:[],
    newProductSizes:[],
    selectedSizes:[],
    colors:[],
    newProductColors:[],
    selectedColors:[],
    createDataType:[
        {
            icon:'cpppNewType',
            popupTitle:'CREAR TIPO DE PRODUCTO',
            popupLabel:'Producto',
            data:'productsTypes',
            attributeName:'product_type',
            table:'cuttings_products_types',
            error:'El tipo de producto ingresado ya existe',
            input:cpppType
        },
        {
            icon:'cpppNewFabric',
            popupTitle:'CREAR TELA',
            popupLabel:'Tela',
            data:'fabrics',
            attributeName:'fabric',
            table:'cuttings_fabrics',
            error:'La tela ingresada ya existe',
            input:cpppFabric

        },
        {
            icon:'ecppNewColor',
            popupTitle:'CREAR COLOR',
            popupLabel:'Color',
            data:'colors',
            attributeName:'color',
            table:'cuttings_colors',
            error:'El color ingresado ya existe'
        },
        {
            icon:'esppNewSize',
            popupTitle:'CREAR TALLE',
            popupLabel:'Talle',
            data:'sizes',
            attributeName:'size',
            table:'cuttings_sizes',
            error:'El talle ingresado ya existe'
        },
        {
            input: cpppFabric,
            list: cpppPredictedFabrics,
            apiUrl: 'apis/cuttings/data/predict-fabrics/',
            name: 'fabric',
            elementName: 'fabric'
        },
        {
            input: cpppType,
            list: cpppPredictedTypes,
            apiUrl: 'apis/cuttings/data/predict-products-types/',
            name: 'product_type',
            elementName: 'productType'
        },
    ],
    createDataTypeSelected:{},
    //CREATE-EDIT ORDER
    fabrics:[],
    productsTypes:[],
    productSizes:[],
    selectedSizes:[],
    productColors:[],
    selectedColors:[],
    orderDetails: [],
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
    errorsQty:0,
    customerData:[],
    createPaymentMethodFrom:''
}

export default og