
let dg = {
    createDataType:[
        {
            icon:'createType',
            popupTitle:'CREAR TIPO DE PRODUCTO',
            popupLabel:'Producto',
            data:'productsTypes',
            attributeName:'products_type',
            table:'cuttings_products_types'
        },
        {
            icon:'createFabric',
            popupTitle:'CREAR TELA',
            popupLabel:'Tela',
            data:'fabrics',
            attributeName:'fabric',
            table:'cuttings_fabrics'
        },
        {
            icon:'createColor',
            popupTitle:'CREAR COLOR',
            popupLabel:'Color',
            data:'colors',
            attributeName:'color',
            table:'cuttings_colors'
        },
        {
            icon:'createSize',
            popupTitle:'CREAR TALLE',
            popupLabel:'Talle',
            data:'sizes',
            attributeName:'size',
            table:'cuttings_sizes'
        }
    ],
    createDataTypeSelected:{},
    productsTypes:[],
    fabrics:[],
    colors:[],
    sizes:[],
    loaders:[productsTypesLoader, fabricsLoader, colorsLoader, sizesLoader],
    bodys:[productsTypesBody, fabricsBody, colorsBody, sizesBody],    
    idElementToEdit:0,
    tableToEdit:'',
    tableTitle:'',
}

export default dg