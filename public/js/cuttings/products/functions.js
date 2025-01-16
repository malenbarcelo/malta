import { dominio } from "../../dominio.js"
import pg from "./globals.js"
import {isValid, isInvalid } from "../../generalFunctions.js"

async function getData() {

    //get data
    pg.productsTypes = await (await fetch(dominio + 'apis/cuttings/data/products-types')).json()
    pg.fabrics = await (await fetch(dominio + 'apis/cuttings/data/fabrics')).json()
    pg.colors = await (await fetch(dominio + 'apis/cuttings/data/colors')).json()
    pg.sizes = await (await fetch(dominio + 'apis/cuttings/data/sizes')).json()
    pg.season = await (await fetch(dominio + 'apis/main/current-season')).json()
    pg.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + pg.season.season)).json()
    pg.productsFiltered = pg.products

}

function completeESPPsizes() {
    
    esppSizes.innerHTML = ''
    
    pg.sizes.forEach(size => {
        const checked = (pg.action == 'create' && pg.newProductSizes.filter(nps => nps.id == size.id).length == 0) || (pg.action == 'edit' && pg.productSizes.filter(ps => ps.id_sizes == size.id).length == 0) ? '' : 'checked'
        esppSizes.innerHTML += '<div class="divCheckbox1"><input type="checkbox" id="size_' + size.id + '" ' + checked + '><label>' + size.size + '</label></div>'
    })

    //add event listeners
    pg.sizes.forEach(size => {
        const check = document.getElementById('size_' + size.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                if (pg.action == 'create') {
                    pg.selectedSizes.push({id:size.id,size:size.size})
                }else{
                    pg.productSizes.push({id_products:pg.idProductToEdit,id_sizes:size.id,size_data:size})
                }
            }else{
                if (pg.action == 'create') {
                    pg.selectedSizes = pg.selectedSizes.filter( ss => ss.id != size.id)
                }else{
                    pg.productSizes = pg.productSizes.filter( ps => ps.id_sizes != size.id)
                }
            }
        })
    })
}

function completeECPPcolors() {
    
    ecppColors.innerHTML = ''
    
    pg.colors.forEach(color => {
        const checked = (pg.action == 'create' && pg.newProductColors.filter(nps => nps.id == color.id).length == 0) || (pg.action == 'edit' && pg.productColors.filter(ps => ps.id_colors == color.id).length == 0) ? '' : 'checked'
        ecppColors.innerHTML += '<div class="divCheckbox1 divColor"><input type="checkbox" id="color_' + color.id + '" ' + checked + '><label>' + color.color + '</label></div>'
    })

    //add event listeners
    pg.colors.forEach(color => {
        const check = document.getElementById('color_' + color.id)
        check.addEventListener("click", () => {
            if (check.checked) {
                if (pg.action == 'create') {
                    pg.selectedColors.push({id:color.id,color:color.color})
                }else{
                    pg.productColors.push({id_products:pg.idProductToEdit,id_colors:color.id,color_data:color})
                }
                
            }else{
                if (pg.action == 'create') {
                    pg.selectedColors = pg.selectedColors.filter( sc => sc.id != color.id)
                }else{
                    pg.productColors = pg.productColors.filter( pc => pc.id_colors != color.id)
                }
            }
        })
    })

}

async function cpppValidations() {
    let errors = 0
    const findType = pg.productsTypes.filter(pt => pt.product_type.toLowerCase() == cpppType.value.toLowerCase())
    const findFabric = pg.fabrics.filter(f => f.fabric.toLowerCase() == cpppFabric.value.toLowerCase())
    pg.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + pg.season.season)).json() //get products again in case someone else has created any product
    const findCode = pg.products.filter(p => p.product_code.toLowerCase() == cpppCode.value.toLowerCase() && p.season == pg.season.season)

    if (findCode.length > 0 && pg.codeToEdit != cpppCode.value) {
        errors += 1
        isInvalid([cpppCode])
        cpppCodeError.style.display = 'none'
        cpppCodeError2.style.display = 'block'
    }else{
        isValid([cpppCode])
        cpppCodeError.style.display = 'none'
        cpppCodeError2.style.display = 'none'
    }
    
    if (findType.length === 0) {
        errors += 1
        isInvalid([cpppType])
        cpppTypeError.style.display = 'none'
        cpppTypeError2.style.display = 'block'
    }else{
        isValid([cpppType])
        cpppTypeError.style.display = 'none'
        cpppTypeError2.style.display = 'none'
    }

    if (findFabric.length === 0) {
        errors += 1
        isInvalid([cpppFabric])
        cpppFabricError.style.display = 'none'
        cpppFabricError2.style.display = 'block'
    }else{
        isValid([cpppFabric])
        cpppFabricError.style.display = 'none'
        cpppFabricError2.style.display = 'none'
    }

    return errors
    
}


export {getData,completeESPPsizes,completeECPPcolors,cpppValidations}