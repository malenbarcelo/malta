let g = {
    cuttings:[],
    molds:[],
    // popups
    popups: [cecpp,celpp,copp],
    cecppInputs: [cecppDate, cecppCutting, cecppMold, cecppDescription],
    celppInputs: [celppColorToAdd, celppLayersToAdd, celppKgsMtsToAdd],
    // tooltips
    tooltips: [
        {
            icon:celppIcon,
            right:'20.5%'
        },
        {
            icon:coppIcon,
            right:'17%'
        },          
        {
            icon:cecppIcon,
            right:'14%'
        },
    ],
    // filters
    pages:0,
    filters: {
        size:'',
        page:'',
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
            input: cecppMold,
            list: cecppMoldPredicted,
            apiUrl: 'apis/composed/predict-molds/',
            name: 'mold',
            elementName: 'cecppMold'
        },
    ],
    // order data
    elementsToOrder:['cutting','mold'],
    // edit cutting
    cuttingToEdit:{},
    // layers
    layersDetails:[],
    layersSummary:[],
}

export default g