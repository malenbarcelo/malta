let cg = {
    popups:[ccpp,copp],
    elementsToPredict:[
        {
            input: filterCustomer,
            list: ulPredictedCustomers,
            apiUrl: 'apis/data/customers/predict-customers/',
            name: 'customer_name',
            elementName: 'customer'
        }
    ],
    customers:[],
    ccppInputs: [ccppCustomer,ccppEmail,ccppAddress, ccppCity, ccppCountry,ccppMobile,ccppDiscount,ccppNotes],
    customerToEdit:'',
    idCustomer:0
    
}

export default cg