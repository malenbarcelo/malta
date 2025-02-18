
let g = {
    // main data
    season: {},
    details:[],
    userLogged:'',
    // filters
    filters: {
        size:20,
        page:1,
        order_number:'',
        customer_name:'',
        description:'',
        id_sales_channels:'',
        id_orders_status:'',
        item_status:''
    },
    // popups
    popups: [sscpp,erqpp,appp,dlpp,elcpp,elpp,elspp,lopp],
    // tooltips
    tooltips: [
        {
            icon:elppIcon,
            right:'11.5%'
        },        
        {
            icon:loppIcon,
            right:'9%'
        },
        {
            icon:dlppIcon,
            right:'6%'
        }
    ],
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // predicts elements
    elementsToPredict:[
        {
            input: filterCustomer,
            list: ulPredictedCustomers,
            apiUrl: 'apis/data/customers/predict-customers/',
            name: 'customer_name',
            elementName: 'customer'
        },
        {
            input: filterProduct,
            list: ulPredictedProducts,
            apiUrl: '',
            name: 'full_description',
            elementName: 'product'
        },
        {
            input: apppProduct,
            list: ulPredictedProducts2,
            apiUrl: '',
            name: 'full_description',
            elementName: 'product'
        },
        {
            input: apppCustomer,
            list: ulPredictedCustomers2,
            apiUrl: 'apis/data/customers/predict-customers/',
            name: 'customer_name',
            elementName: 'customer'
        },
    ],
    // edit line popup
    lineToEdit:{},
    lineToEditColroes:[],
    lineToEditSizes:[],
    productColors:[],
    productSizes:[],
    // delete line popup
    lineToDelete:{},
    // add products popup
    productsToAdd:[],
    customersProductsToAdd:[],
    customers:[],
    products:[],
    rowToEdit:0
}

export default g