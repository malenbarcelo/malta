let g = {
    popups:[copp,oipp,eshpp],
    tableIcons: [
        {
            icon:rsppIcon,
            right:'12%'
        },
        {
            icon:esppIcon,
            right:'9.5%'
        },
    ],
    elementsToPredict:[
        {
            input: customer,
            list: ulPredictedCustomers,
            apiUrl: 'apis/data/customers/predict-customers/',
            name: 'customer_name',
            elementName: 'customer'
        }
    ],
    idOrderToEdit:0,
    idCustomerToEdit:0,
    initialMobile:'s',
    idOrderToDeliver:0
}

export default g