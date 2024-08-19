
let cg = {
    formatter:new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    }),
    customersSummary:[],
    customersSummaryFiltered:[],
    idCustomer:0
}

export default cg