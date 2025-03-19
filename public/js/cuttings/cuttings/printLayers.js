
import g from "./globals.js"
import { isValid } from "../../generalFunctions.js"

async function printLayers() {
    
    const dataToPrint = g.action == 'create' ? g.layersToCreate : g.layersToEdit
        
    detailsBody.innerHTML = ''

    let counter = 0
    const fragment = document.createDocumentFragment()  

    dataToPrint.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody4 tBodyEven' : 'tBody4 tBodyOdd'
                
        const row = document.createElement('tr')
        row.id = 'trLayers_' + element.position

        row.innerHTML = `
            <th class="${rowClass}">${element.position}</th>
            <th class="${rowClass}">${element.color || ''}</th>
            <th class="${rowClass}">${element.layers || ''}</th>
            <th class="${rowClass}">${element.kgs_mts || ''}</th>
            <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="editRow_${element.position}"></i></th>
        `
        fragment.appendChild(row)

        counter += 1
    })

    detailsBody.appendChild(fragment)

    // event listeners
    layersEventListeners() 
}

function layersEventListeners() {

    const data = g.action == 'create' ? g.layersToCreate : g.layersToEdit

    data.forEach(element => {

        const editRow = document.getElementById('editRow_' + element.position)
        const trLayers = document.getElementById('trLayers_' + element.position)

        // edit
        editRow.addEventListener('click',async()=>{
            isValid([elppColor, elppLayers, elppKgsMts])
            elppColor.value = element.color
            elppLayers.value = element.layers
            elppKgsMts.value = element.kgs_mts
            
            g.positionToEdit = element.position
            elppTitle.innerText = 'EDITAR LÍNEA ' + element.position
            elpp.style.display = 'block'
            elppColor.focus()
        })

        //edit row with double click
        trLayers.addEventListener('dblclick',async()=>{
            editRow.click()
        })
        
    })
    
}

function printLayersSummary() {

    layersSummary.innerHTML = ''
    let html = ''
    g.selectedCuttingsToEdit.forEach(element => {

        html += `
            <div class="d-f-r j-c-c c-g-5 m-b-5 f-s-12">
                <div class="w-90 d-f-r a-i-c"><b>CORTE #${element.cutting}</b></div>
                <div class="w-70 d-f-r c-g-5 a-i-c"><b>CAPAS:</b><div class="w-50" id="layers_${element.id}">0</div></div>
                <div class="w-80 d-f-r c-g-5 a-i-c j-c-c"><b>BASE:</b><input class="input-1 w-30 f-s-12" type="text" value="${(element.base || '')}" id="base_${element.id}"></div>
                <div class="w-70 d-f-r a-i-c j-c-c" id="perc_${element.id}"></div>
                <div class="w-100 d-f-r c-g-5 a-i-c"><b>PRENDAS:</b><div class="w-80" id="garments_${element.id}"></div></div>
                <div class="w-100 d-f-r c-g-5 a-i-c"><b>KGS/MTS:</b><div class="w-80" id="kgsMts_${element.id}">0</div></div>
            </div>
        `
    })

    html += `
            <div class="d-f-r j-c-c c-g-5 m-b-5 f-s-12">
                <div class="w-90 d-f-r a-i-c"><b>TOTAL</b></div>
                <div class="w-70 d-f-r c-g-5 a-i-c"><b>CAPAS:</b><div class="w-50" id="totalLayers">0</div></div>
                <div class="w-80 d-f-r c-g-5 a-i-c j-c-c"><b>BASE:</b><input class="input-1 w-30 f-s-12 unabledInput" type="text" value="${g.totalBase == 0 ? '' : g.totalBase}" id="totalBase" readonly></div>
                <div class="w-70 d-f-r a-i-c j-c-c">100.00%</div>
                <div class="w-100 d-f-r c-g-5 a-i-c"><b>PRENDAS:</b><div class="w-80" id="garments"></div></div>
                <div class="w-100 d-f-r c-g-5 a-i-c"><b>KGS/MTS:</b><input class="input-1 w-50 f-s-12" type="text" step="0.01" value="${g.totalKgsMts == 0 ? '' : g.totalKgsMts}" id="totalKgsMts"></div>
            </div>
        `

    layersSummary.innerHTML = html

    // update data
    updateData()
    
    // event listeners
    layersSummaryEventListeners()
}

function layersSummaryEventListeners() {

    g.selectedCuttingsToEdit.forEach(element => {

        const base = document.getElementById('base_' + element.id)

        // change base
        base.addEventListener('change',async()=>{
            const cuttingToEdit = g.selectedCuttingsToEdit.find(sc => sc.id == element.id)
            cuttingToEdit.base = (base.value == null || base.value == '') ? 0 : parseInt(base.value)
            g.totalBase = g.selectedCuttingsToEdit.reduce((total, sc) => total + ((sc.base == null || sc.base == '') ? 0 : parseInt(sc.base)), 0)
            totalBase.value = g.totalBase
            updateData()
        })
        
    })
    
}

function updateData() {
    
    g.selectedCuttingsToEdit.forEach(element => {
        const totalLayers = document.getElementById('layers_' + element.id)
        const perc = document.getElementById('perc_' + element.id)
        const garments = document.getElementById('garments_' + element.id)
        const kgsMts = document.getElementById('kgsMts_' + element.id)        
        const percentage = (element.base == null || element.base == '' || element.base == 0 || g.totalBase == 0) ? 0 : ((parseFloat(element.base,2) / parseFloat(g.totalBase,2)) * 100).toFixed(2)        
        totalLayers.innerText = g.totalLayers
        perc.innerText = percentage + '%'
        garments.innerText = g.totalLayers * ((element.base == null || element.base == '') ? 0 : parseInt(element.base))
        kgsMts.innerText = (g.totalKgsMts * parseFloat(percentage / 100,2)).toFixed(2)
    })
    
    totalLayers.innerText = g.totalLayers
    garments.innerText = g.totalLayers * g.totalBase
    totalKgsMts.value = g.totalKgsMts.toFixed(2)
}

export { printLayers, printLayersSummary }