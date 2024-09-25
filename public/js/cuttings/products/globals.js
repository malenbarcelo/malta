
let pg = {
    elementsToPredict:[
        {
            input: filterDescription,
            list: filterDescriptionPredicted,
            apiUrl: '',
            name: 'description',
            elementName: 'productDescription'
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
        {
            input: filterType,
            list: filterTypePredicted,
            apiUrl: 'apis/cuttings/data/predict-products-types/',
            name: 'product_type',
            elementName: 'productType'
        }
        
    ],
    products:[],
    productsFiltered:[],
    productsTypes:[],
    fabrics:[],
    colors:[],
    sizes:[],
    season:'',
    newProductSizes:[{id:1,size:'U'}],
    productSizes:[],
    selectedSizes:[],
    newProductColors:[{id:1,color:'Blanco'},{id:2,color:'Negro'}],
    productColors:[],
    selectedColors:[],
    action:'',
    idProductToEdit:0
    
}

export default pg