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
    clearLayers: async function() {

        g.layersToCreate.forEach(ltc => {
            ltc.color = null;
            ltc.layers = null;
            ltc.kgs_mts = null;
        })

        g.totalBase = 0
        g.totalLayers = 0
        g.totalKgsMts = 0

    },
    restablishSelectedCuttings: async function() {
        g.selectedCuttings = []
        g.selectedCuttingsToEdit = []

        g.cuttings.forEach(element => {
            const check = document.getElementById('check_' + element.id)
            if (check) {
                check.checked = false
            }
        })
    },
}

export { f }