let pmg = {
    elementsToPredict:[
        {
            input: filterMethod,
            list: ulPredictedMethods,
            apiUrl: 'apis/data/payment-methods/predict-payment-methods/',
            name: 'payment_method',
            elementName: 'method'
        }
    ],
    paymentMethods:[],
    cpmppInputs: [cpmppPaymentMethod],
    paymentMethodToEdit:'',
    idPaymentMethod:0
    
}

export default pmg