import { dominio } from "../../dominio.js"
import g from "./globals2.js"
import { printDetails } from "./printDetails2.js"

const f = {

    getGeneralData: async function() {
        g.season = await (await fetch(dominio + 'apis/main/current-season')).json()
        g.userLogged = userLogged.innerText
        g.elementsToPredict[1].apiUrl = 'apis/cuttings/products/predict-season-products/' + g.season.season + '/'
        g.elementsToPredict[2].apiUrl = 'apis/cuttings/products/predict-season-products/' + g.season.season + '/'
    },

    getDetails: async function() {

        // get orders details
        let filters = ''
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`
        filters += g.filters.order_number == '' ? '' : `&order_number=${g.filters.order_number}`
        filters += g.filters.customer_name == '' ? '' : `&customer_name=${g.filters.customer_name}`
        filters += g.filters.description == '' ? '' : `&description=${g.filters.description}`
        filters += g.filters.id_sales_channels == '' ? '' : `&id_sales_channels=${g.filters.id_sales_channels}`
        filters += g.filters.id_orders_status == '' ? '' : `&id_orders_status=${g.filters.id_orders_status}`
        filters += g.filters.item_status == '' ? '' : `&item_status=${g.filters.item_status}`

        console.log(`${dominio}apis/get/sales-orders-details?${filters}`)

        const fetchData = await (await fetch(`${dominio}apis/get/sales-orders-details?${filters}`)).json()

        return fetchData.rows

    },

    updateData: async function() {

        //update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        //get and print data
        g.details = await f.getDetails()
        printDetails()

        ordersDetailsTable.scrollTop = 0

    },
}

export { f }