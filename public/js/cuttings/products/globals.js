
let pg = {
    elementsToPredict:[
        {
            input: filterDescription,
            list: filterDescriptionPredicted,
            apiUrl: '',
            name: 'full_description',
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
        }
    ],
    createDataTypeSelected:{},
    products:[],
    productsFiltered:[],
    productsTypes:[],
    fabrics:[],
    colors:[],
    sizes:[],
    season:'',
    newProductSizes:[{id:26,size:'U'}],
    productSizes:[],
    selectedSizes:[],
    newProductColors:[{id:35,color:'BLANCO'},{id:36,color:'NEGRO'}],
    productColors:[],
    selectedColors:[],
    action:'',
    idProductToEdit:0,
    codeToEdit:'',
    idProductToDelete:0
    
}

export default pg