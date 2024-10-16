
let odg = {
    season:'',
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
        }
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
    selectedColors:[],

}

export default odg