let g = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 2,
        useGrouping: true
    }),
    popups:[],
    season:{},
    // tableIcons: [
    //     {
    //         icon:rsppIcon,
    //         right:'12%'
    //     },
    //     {
    //         icon:esppIcon,
    //         right:'9.5%'
    //     },
    // ],
    elementsToPredict:[
        {
            input: customer,
            list: ulPredictedCustomers,
            apiUrl: 'apis/data/customers/web/predict-customers/',
            name: 'customer',
            elementName: 'customer'
        }
    ],
    orders:[],
    ordersFiltered:[]
}

export default g