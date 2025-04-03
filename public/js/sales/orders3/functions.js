import { dominio } from "../../dominio.js"
import g from "./globals.js"

const f = {

    getData: async function() {
        g.season = await (await fetch(dominio + 'apis/main/current-season')).json()
        g.userLogged = userLogged.innerText
        g.ordersManagers = await (await fetch(dominio + 'apis/get/users')).json()
        
    },

    getOrders: async function() {

        // get data
        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.cutting == '' ? '' : `&cutting=${g.filters.cutting}`
        filters += g.filters.mold_string == '' ? '' : `&mold_string=${g.filters.mold_string}`
        filters += g.filters.description == '' ? '' : `&description=${g.filters.description}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${dominio}apis/get/cuttings?${filters}`)).json()

        return fetchData.rows
    },

    selectOrderManager: async function() {
        filterOrderManager.value = g.userLogged
        const salesChannelId = g.ordersManagers.find(om => om.id == g.userLogged).id_sales_channels
        let salesChannel
        if (salesChannelId != null && salesChannelId != 0) {
            salesChannel = document.getElementById('channel_' + salesChannelId)
            g.channelsChecked.push(salesChannel)
            salesChannel.checked = true
        }   
    },
}

export { f }