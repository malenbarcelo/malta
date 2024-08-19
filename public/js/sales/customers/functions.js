import cg from "./globals.js"

function applyFilters() {
    cg.customersSummaryFiltered = cg.customersSummary

    //customer
    cg.customersSummaryFiltered = filterCustomer.value == '' ? cg.customersSummaryFiltered : cg.customersSummaryFiltered.filter(c => c.customer_name == filterCustomer.value)
}



export {applyFilters}