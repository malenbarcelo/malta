
let odg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    season:'',
    userLogged:'',
    popups: [sscpp,appp,dlpp,elcpp,elpp,elspp,lopp],
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
    customers:[],
    products:[],
    ordersManagers: [],
    orders:[],
    ordersDetails: [],
    ordersDetailsFiltered: [],
    orderToEditLines:[],
    lineToDelete:[],
    lineToEdit:[],
    productsToAdd:[],
    createOrder:false,
    salesChannel:0,
    productSizes:[],
    selectedSizes:[],
    productColors:[],
    selectedColors:[]

}

export default odg