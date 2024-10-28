
let dg = {
    popups: [cdpp,cddpp],
    createDataType:[
        {
            icon:'createType',
            popupTitle:'CREAR TIPO DE PRODUCTO',
            popupLabel:'Producto',
            data:'productsTypes',
            attributeName:'product_type',
            table:'cuttings_products_types',
            error:'El tipo de producto ingresado ya existe'
        },
        {
            icon:'createFabric',
            popupTitle:'CREAR TELA',
            popupLabel:'Tela',
            data:'fabrics',
            attributeName:'fabric',
            table:'cuttings_fabrics',
            error:'La tela ingresada ya existe'
        },
        {
            icon:'createColor',
            popupTitle:'CREAR COLOR',
            popupLabel:'Color',
            data:'colors',
            attributeName:'color',
            table:'cuttings_colors',
            error:'El color ingresado ya existe'
        },
        {
            icon:'createSize',
            popupTitle:'CREAR TALLE',
            popupLabel:'Talle',
            data:'sizes',
            attributeName:'size',
            table:'cuttings_sizes',
            error:'El talle ingresado ya existe'
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