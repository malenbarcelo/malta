let g = {
    molds:[],
    // popups
    popups: [cempp,impp],
    cemppInputs: [cemppMold,cemppDescription, cemppImage],
    // filters
    pages:0,
    filters: {
        size:'',
        page:'',
        mold:'',
        moldString:'',
        description:'',
        order: '[["mold","ASC"]]'
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
            apiUrl: 'apis/composed/predict-molds-descriptions/',
            name: 'description',
            elementName: 'description'
        },
    ],
    // order data
    elementsToOrder:['mold','description'],
    // edit mold
    moldToEdit:{}
}

export default g