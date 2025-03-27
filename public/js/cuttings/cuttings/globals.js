let g = {
    cuttings:[],
    molds:[],
    escNumber:0,
    // popups
    popups: [dlpp, schpp, elpp,cecpp,celpp],
    cecppInputs: [cecppDate, cecppCutting, cecppMold, cecppDescription],
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // tooltips
    tooltips: [
        {
            icon:celppIcon,
            right:'18.5%'
        },      
        {
            icon:cecppIcon,
            right:'15%'
        },
    ],
    // filters
    pages:0,
    filters: {
        size:'',
        page:'',
        cutting:'',
        mold_string:'',
        description:'',
        order: '[["cutting","ASC"]]'
    },
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // predicts elements
    elementsToPredict:[
        {
            input: mold,
            list: moldPredicted,
            apiUrl: 'apis/composed/predict-molds/',
            name: 'mold',
            elementName: 'mold'
        },
        {
            input: description,
            list: descriptionPredicted,
            apiUrl: 'apis/composed/predict-cuttings-descriptions/',
            name: 'description',
            elementName: 'description'
        },
        {
            input: cecppMold,
            list: cecppMoldPredicted,
            apiUrl: 'apis/composed/predict-molds/',
            name: 'mold',
            elementName: 'cecppMold'
        }
    ],
    // edit
    cuttingToEdit:{},
    // order data
    elementsToOrder:['date','cutting','description'],
    // layers
    totalBase: 0,
    totalLayers:0,
    totalKgsMts:0,
    selectedCuttings:[],
    selectedCuttingsToEdit:[],
    action: '',
    positionToEdit:0,
    layers:[],
    layersToEdit:[],
    layersToCreate:[
        {
            position:1,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:2,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:3,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:4,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:5,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:6,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:7,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:8,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:9,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:10,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:11,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:12,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:13,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:14,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:15,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:16,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:17,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:18,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:19,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:20,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:21,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:22,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:23,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:24,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:25,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:26,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:27,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:28,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:29,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:30,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:31,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:32,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:33,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:34,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:35,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:36,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:37,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:38,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:39,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:40,
            id_layers:null,
            color:null,
            layers:null,
            kgs_mts:null
        },
    ]
}

export default g