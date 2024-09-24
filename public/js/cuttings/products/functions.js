import { dominio } from "../../dominio.js"
import pg from "./globals.js"

async function getData() {

    //get data
    pg.productsTypes = await (await fetch(dominio + 'apis/cuttings/data/products-types')).json()
    pg.fabrics = await (await fetch(dominio + 'apis/cuttings/data/fabrics')).json()
    pg.colors = await (await fetch(dominio + 'apis/cuttings/data/colors')).json()
    pg.sizes = await (await fetch(dominio + 'apis/cuttings/data/sizes')).json()
    pg.season = await (await fetch(dominio + 'apis/main/current-season')).json()

    //complete selects
    cpppType.innerHTML = '<option value=""></option>'
    cpppFabric.innerHTML = '<option value=""></option>'
    
}

function completeESPPsizes() {
    
    esppSizes.innerHTML = ''
    
    pg.sizes.forEach(size => {
        const checked = pg.newProductSizes.filter(nps => nps.id == size.id).length == 0 ? '' : 'checked'
        esppSizes.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="size_' + size.id + '" ' + checked + '><label>' + size.size + '</label></div>'
    })

    //add event listeners
    pg.sizes.forEach(size => {
        const check = document.getElementById('size_' + size.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                pg.selectedSizes.push({id:size.id,size:size.size})
            }else{
                pg.selectedSizes = pg.selectedSizes.filter( ss => ss.id != size.id)
            }
        })
    })
    

    

}

function completeECPPcolors() {
    
    ecppColors.innerHTML = ''
    
    pg.colors.forEach(color => {
        const checked = pg.newProductColors.filter(npc => npc.id == color.id).length == 0 ? '' : 'checked'
        ecppColors.innerHTML += '<div class="divCheckbox1 divColor"><input type="checkbox" id="color_' + color.id + '" ' + checked + '><label>' + color.color + '</label></div>'
    })

    //add event listeners
    pg.colors.forEach(color => {
        const check = document.getElementById('color_' + color.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                pg.selectedColors.push({id:color.id,color:color.color})
            }else{
                pg.selectedColors = pg.selectedColors.filter( sc => sc.id != color.id)
            }
        })
    })
    

    

}


export {getData,completeESPPsizes,completeECPPcolors}