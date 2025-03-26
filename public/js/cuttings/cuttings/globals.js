let g = {
    cuttings:[],
    molds:[],
    escNumber:0,
    // popups
    popups: [schpp, elpp,cecpp,celpp],
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
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:2,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:3,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:4,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:5,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:6,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:7,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:8,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:9,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:10,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:11,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:12,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:13,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:14,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:15,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:16,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:17,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:18,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:19,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:20,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:21,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:22,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:23,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:24,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:25,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:26,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:27,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:28,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:29,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:30,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:31,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:32,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:33,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:34,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:35,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:36,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:37,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:38,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:39,
            color:null,
            layers:null,
            kgs_mts:null
        },
        {
            position:40,
            color:null,
            layers:null,
            kgs_mts:null
        },
    ]
}

export default g