import { dominio } from "../../dominio.js"
import g from "./globals.js"

const f = {
    getData: async function() {

        // get data
        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.mold == '' ? '' : `&mold=${g.filters.mold}`
        filters += g.filters.moldString == '' ? '' : `&mold_string=${g.filters.moldString}`
        filters += g.filters.description == '' ? '' : `&description=${g.filters.description}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`

        const fetchData = await (await fetch(`${dominio}apis/get/cuttings-molds?${filters}`)).json()

        return fetchData.rows

    },
}

export { f }