import { dominio } from "../../dominio.js"
import g from "./globals.js"
import { dateToString } from "../../generalFunctions.js"
import { printTable } from "./printTable.js"

const f = {
    getData: async function() {

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
    restoreData: async function() {
        
        // update filters
        g.filters.page = 1
        g.filters.size = 25        

        // update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0
        
        // get data 
        g.cuttings = await this.getData()

        // print table
        printTable()

        // scroll up
        table.scrollTop = 0  
        
    },
    clearLayersToCreate: async function() {
        g.layersToCreate.forEach(ltc => {
            ltc.color = null;
            ltc.layers = null;
            ltc.kgs_mts = null;
        })
    },
    updateTotalsData: async function() {
        const layers = g.action == 'create' ? g.layersToCreate : g.layersToEdit
        const sumLayers = layers.reduce((total, c) => total + ((c.kgs_mts == null) ? 0 : parseFloat(c.kgs_mts,2)), 0)
        g.totalBase = g.selectedCuttingsToEdit.reduce((total, c) => total + ((c.base == null) ? 0 : parseInt(c.base)), 0)
        g.totalLayers = layers.reduce((total, l) => total + ((l.layers == null) ? 0 : parseInt(l.layers)), 0)
        
        g.totalKgsMts = sumLayers == 0 ? g.selectedCuttingsToEdit.reduce((total, c) => total + ((c.kgs_mts == null) ? 0 : parseFloat(c.kgs_mts,2)), 0) : sumLayers
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
    printLayersSummary: async function() {
        layersSummary.innerHTML = ''
        let html = ''
        g.selectedCuttingsToEdit.forEach(element => {

            html += `
                <div class="d-f-r j-c-c c-g-5 m-b-5 f-s-12">
                    <div class="w-90 d-f-r a-i-c"><b>CORTE #${element.cutting}</b></div>
                    <div class="w-90 d-f-r c-g-5 a-i-c"><b>CAPAS:</b><div class="w-50" id="layers_${element.id}">0</div></div>
                    <div class="w-90 d-f-r c-g-5 a-i-c j-c-c"><b>BASE:</b><input class="input-1 w-30 f-s-12" type="text" value="${(element.base || '')}" id="base_${element.id}"></div>
                    <div class="w-90 d-f-r a-i-c j-c-c" id="perc_${element.id}"></div>
                    <div class="w-120 d-f-r c-g-5 a-i-c"><b>PRENDAS:</b><div class="w-80" id="garments_${element.id}"></div></div>
                    <div class="w-120 d-f-r c-g-5 a-i-c"><b>KGS/MTS:</b><div class="w-80" id="kgsMts_${element.id}">0</div></div>
                </div>
            `
        })

        html += `
                <div class="d-f-r j-c-c c-g-5 m-b-15 f-s-12">
                    <div class="w-90 d-f-r a-i-c"><b>TOTAL</b></div>
                    <div class="w-90 d-f-r c-g-5 a-i-c"><b>CAPAS:</b><div class="w-50" id="totalLayers">0</div></div>
                    <div class="w-90 d-f-r c-g-5 a-i-c j-c-c"><b>BASE:</b><input class="input-1 w-30 f-s-12 unabledInput" type="text" value="${g.totalBase == 0 ? '' : g.totalBase}" id="totalBase" readonly></div>
                    <div class="w-90 d-f-r a-i-c j-c-c">100.00%</div>
                    <div class="w-120 d-f-r c-g-5 a-i-c"><b>PRENDAS:</b><div class="w-80" id="totalGarments"></div></div>
                    <div class="w-120 d-f-r c-g-5 a-i-c"><b>KGS/MTS:</b><input class="input-1 w-50 f-s-12" type="text" step="0.01" value="${g.totalKgsMts == 0 ? '' : g.totalKgsMts}" id="totalKgsMts" autocomplete="off"></div>
                </div>
            `

        layersSummary.innerHTML = html

        //event listeners
        g.selectedCuttingsToEdit.forEach(element => {

            const base = document.getElementById('base_' + element.id)

            // change base
            base.addEventListener('change',async()=>{
                const cuttingToEdit = g.selectedCuttingsToEdit.find(sc => sc.id == element.id)
                cuttingToEdit.base = base.value == '' ? null : parseInt(base.value)
                this.updateTotalsData()
                totalBase.value = g.totalBase
                this.updateLayersSummary()
                this.printCuttingOrders()                
            })

        })

        // change kgsMts
        totalKgsMts.addEventListener('change',async()=>{
            g.totalKgsMts = parseFloat(totalKgsMts.value,2)
            this.updateLayersSummary()
            this.printCuttingOrders()
        })
    },
    updateLayersSummary: async function() {

        g.selectedCuttingsToEdit.forEach(element => {
            
            //layers
            const layers = document.getElementById('layers_' + element.id)
            layers.innerText = g.totalLayers

            //base
            const base = document.getElementById('base_' + element.id)
            base.value = element.base

            //percentage
            const perc = document.getElementById('perc_' + element.id)
            const percentage = (element.base == null || element.base == 0 || g.totalBase == 0) ? 0 : ((parseFloat(element.base,2) / parseFloat(g.totalBase,2)) * 100).toFixed(2)
            perc.innerText = percentage + '%'

            //garments
            const garments = document.getElementById('garments_' + element.id)
            garments.innerText = g.totalLayers * (parseInt(element.base) || 0)

            //kgsMts
            const kgsMts = document.getElementById('kgsMts_' + element.id)
            const kgsMtsValue = g.totalKgsMts * parseFloat(percentage / 100,2)
            kgsMts.innerText = parseFloat(kgsMtsValue,2).toFixed(2)
            element.kgs_mts = parseFloat(kgsMtsValue,2)

        })
        
        totalLayers.innerText = g.totalLayers
        totalGarments.innerText = g.totalLayers * g.totalBase
        totalKgsMts.value = g.totalKgsMts.toFixed(2)

        // allow edit kgs mts
        const layers = g.action == 'create' ? g.layersToCreate : g.layersToEdit
        const sumLayers = layers.reduce((total, c) => total + ((c.kgs_mts == null) ? 0 : parseFloat(c.kgs_mts,2)), 0)
        
        if (sumLayers == 0) {
            totalKgsMts.readOnly = false
        }else{
            totalKgsMts.readOnly = true
        }

    },
    printCuttingOrders: async function() {
        
        celppCuttingOrders.innerHTML = ''
        let html = ''
        g.selectedCuttingsToEdit.forEach(element => {

            const image = element.mold_data.image ? `<img src="/images/moldsImages/${element.mold_data.image}" class="h-350"></img>` : ''

            html += `
                <div class="b-2-black m-t-5">
                    <div class="popupTitle1 m-t-15 m-b-20">ORDEN DE CORTE (${element.mold_data.mold})</div>                
                    <div class="d-f-r j-c-c c-g-5">
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>#CORTE</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc">${element.cutting}</div>
                        </div>
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>FECHA</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc">${dateToString(element.date)}</div>
                        </div>
                    </div>
                    <div class="d-f-r j-c-c c-g-5 m-t-5 m-b-5">
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>MODELO</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc">${element.mold_data.mold}</div>
                        </div>
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>TELA</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"></div>
                        </div>
                    </div>
                    <div class="w-80-perc m-a cuoppImageDiv pos-r">
                        <div class="popupTitle1 m-t-15 m-b-15" id="celppTitle">DESCRIPCIÓN</div>
                        <div class="h-350 d-f-r j-c-c m-b-20" id="celppImage_${element.id}">${image}</div>
                        <i class="fa-regular fa-trash-can f-s-20 pos-a b-10 r-10 pointer ${(element.mold_data.image == null || element.mold_data.image == null) ? 'notVisible' : ''}" id="dropImage_${element.id}"></i>                
                    </div>
                    <div class="d-f-r j-c-c c-g-5 m-t-5">
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>COLLARETA</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"></div>
                        </div>
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>TALLER</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"></div>
                        </div>
                    </div>
                    <div class="d-f-r j-c-c c-g-5 m-t-5">
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>ACCESORIOS</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"></div>
                        </div>
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>FECHA DE SALIDA</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"></div>
                        </div>
                    </div>
                    <div class="d-f-r j-c-c c-g-5 m-t-5">
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>KGS/MTS</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc">${element.kgs_mts.toFixed(2) || ''} ${element.fabric_mu || ''}</div>
                        </div>
                        <div class="d-f-r w-45-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>PRENDAS</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc">${g.totalLayers * element.base}</div>
                        </div>
                    </div>
                    <div class="d-f-r j-c-c c-g-5 m-t-5 m-b-15">
                        <div class="d-f-r w-80-perc">
                            <div class="cuoppOrderTitle h-35 w-35-perc"><b>OBSERVACIONES</b></div>
                            <div class="cuoppOrderValue h-35 w-65-perc"><input type="text" class="b-none t-a-c h-100-perc w-100-perc" value="${element.cutting_order_obs || ''}" id="obs_${element.id}" autocomplete="off"></div>
                        </div>
                    </div>
                </div>
            `
        })

        celppCuttingOrders.innerHTML = html

        //event listeners
        g.selectedCuttingsToEdit.forEach(element => {

            const obs = document.getElementById('obs_' + element.id)
            const dropImage = document.getElementById('dropImage_' + element.id)

            // change observations
            if (dropImage) {
                dropImage.addEventListener('click',async()=>{
                    const celppImage = document.getElementById('celppImage_' + element.id)
                    element.mold_data.image = ''
                    celppImage.innerText = ''
                    dropImage.classList.add('notVisible')              
                })
            }
            
        })

        
    }
}

export { f }