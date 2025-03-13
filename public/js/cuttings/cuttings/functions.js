import { dominio } from "../../dominio.js"
import g from "./globals.js"

const f = {
    getData: async function() {

        // get data
        let filters = ''
        filters += g.filters.page == '' ? '' : `&page=${g.filters.page}`
        filters += g.filters.size == '' ? '' : `&size=${g.filters.size}`
        filters += g.filters.cutting == '' ? '' : `&mold=${g.filters.mold}`
        filters += g.filters.order == '' ? '' : `&order=${g.filters.order}`        

        const fetchData = await (await fetch(`${dominio}apis/get/cuttings?${filters}`)).json()

        return fetchData.rows

    },
}

export { f }