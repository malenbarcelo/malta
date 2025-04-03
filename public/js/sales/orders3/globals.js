let g = {
    orders:[],
    ordersManagers:[],
    escNumber:0,
    // popups
    popups: [],
    // scroll
    loadedPages: new Set(),
    previousScrollTop:0,
    // tooltips
    tooltips: [],
    // filters
    pages:0,
    filters: {
        size:'',
        page:'',
        id_orders_managers:''
    },
    // predicts elements
    elementsToPredict:[],
    //sales channels
    channelsChecked:[]
}

export default g