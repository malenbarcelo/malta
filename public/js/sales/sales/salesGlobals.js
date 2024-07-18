
let sg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    customers:[],
    salesChannels:[],
    filters:[],
    sales:[],
    salesFiltered:[],
    year:0,
    idSaleToDelete:0
}

export default sg