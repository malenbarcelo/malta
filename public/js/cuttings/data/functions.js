import { dominio } from "../../dominio.js"
import dg from "./globals.js"
import { printTable } from "./printTables.js"

async function uploadData() {

    dg.productsTypes = await (await fetch(dominio + 'apis/cuttings/data/products-types')).json()
    dg.fabrics = await (await fetch(dominio + 'apis/cuttings/data/fabrics')).json()
    dg.colors = await (await fetch(dominio + 'apis/cuttings/data/colors')).json()
    dg.sizes = await (await fetch(dominio + 'apis/cuttings/data/sizes')).json()

    printTable(dg.productsTypes,'productsTypes','product_type','Tipos de productos')
    printTable(dg.fabrics,'fabrics','fabric','Telas')
    printTable(dg.colors,'colors','color','Colores')
    printTable(dg.sizes,'sizes','size','Talles')
    
}

function showLoaders() {
    dg.loaders.forEach(loader => {
        loader.style.display = 'block'
    })
}

function hideBodys() {
    dg.bodys.forEach(body => {
        body.innerHTML = ''
    })
}



export {uploadData,showLoaders,hideBodys}