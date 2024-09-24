import pg from "./globals.js"
import { dominio } from "../../dominio.js"
import { predictElements, selectFocusedElement,inputsValidation } from "../../generalFunctions.js"
import { completeESPPsizes,completeECPPcolors } from "./functions.js"


//CREATE PRODUCTS POPUP (CPPP)
async function cpppEventListeners() {

    //predicts products types
    cpppType.addEventListener("input", async(e) => {
        const input = cpppType
        const list = cpppPredictedTypes
        const apiUrl = 'apis/cuttings/data/predict-products-types/'
        const name = 'product_type'
        const elementName = 'productType'
        predictElements(input,list,apiUrl,name,elementName)
    })

    cpppType.addEventListener("keydown", async(e) => {
        const input = cpppType
        const list = cpppPredictedTypes
        const elementName = 'productType'
        selectFocusedElement(e,input,list,elementName)
    })

    //predicts fabrics
    cpppFabric.addEventListener("input", async(e) => {
        const input = cpppFabric
        const list = cpppPredictedFabrics
        const apiUrl = 'apis/cuttings/data/predict-fabrics/'
        const name = 'fabric'
        const elementName = 'fabric'
        predictElements(input,list,apiUrl,name,elementName)
    })

    cpppFabric.addEventListener("keydown", async(e) => {
        const input = cpppFabric
        const list = cpppPredictedFabrics
        const elementName = 'fabric'
        selectFocusedElement(e,input,list,elementName)
    })

    //complete full description
    const inputs = [cpppCode, cpppDescription, cpppFabric]
    inputs.forEach(input => {
        input.addEventListener("change", async(e) => {
            cpppFullDescription.value = cpppCode.value + ' - ' + cpppDescription.value  + ' - ' + cpppFabric.value
        })
    })

    //edit sizes
    cpppSizesIcon.addEventListener("click", () => {
        pg.selectedSizes = [...pg.newProductSizes]
        //complete sizes
        completeESPPsizes()
        esppError.style.display = 'none'
        espp.style.display = 'block'
    })

    //edit colors
    cpppColorsIcon.addEventListener("click", () => {
        pg.selectedColors = [...pg.newProductColors]
        //complete colors
        completeECPPcolors()
        ecppError.style.display = 'none'
        ecpp.style.display = 'block'
    })

    //edit colors
    cpppAccept.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        let errors = inputsValidation(inputs)

        if (errors == 0) {
            const data = {
                product:{
                    product_code:cpppCode.value,
                    id_products_types:pg.productsTypes.filter(pt => pt.product_type == cpppType.value)[0].id,
                    description:cpppDescription.value,
                    id_fabrics:pg.fabrics.filter(f => f.fabric == cpppFabric.value)[0].id,
                    full_description:cpppFullDescription.value,
                    unit_price:parseFloat(cpppPrice.value,2),
                    quantity:0,
                    sold_qty:0,
                    commited_qty:0,
                    stock:0,
                    season:pg.season.season,
                    enabled:1
                },
                sizes:pg.newProductSizes,
                colors:pg.newProductColors
            }

            await fetch(dominio + 'apis/cuttings/products/create-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
            
        }
    })
    

    
    
     
}

export {cpppEventListeners}