
let og = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    lastClickTime:0,
    tableIcons: [
        {
            icon:eoppIcon,
            right:'14%'
        },
        {
            icon:rpppIcon,
            right:'12%'
        },
        {
            icon:pvppIcon,
            right:'9%'
        },
        {
            icon:amppIcon,
            right:'6%'
        },
        {
            icon:obppIcon,
            right:'3%'
        },
        {
            icon:coppIcon,
            right:'0%'
        }
    ],
    popups:[eppp,copp,aeppp,cdpp,espp,ecpp,cppp,cpmpp,caopp,epspp,epcpp,chdpp,eodpp,olopp,ampp,obpp,dopp,ropp,rcppp,rppp,cmpp,ceopp,cbpp],
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
    customerOrders:[],
    channelsChecks:[channel_1, channel_2],
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
    action:'',
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
    customerBalance: 0,
    createPaymentMethodFrom:'',
    changeDiscountFrom:'',
    coppAction: '',
    elementToUpdate:{},
    paymentToEdit:{},
    escNumber:0
}

export default og