import og from "./globals.js"
import { dominio } from "../../dominio.js"
import { inputsValidation, showOkPopup,isValid, clearInputs, isInvalid } from "../../generalFunctions.js"
import { completeESPPsizes,completeECPPcolors,cpppValidations } from "./functions.js"

//CREATE PRODUCTS POPUP (CPPP)
async function cpppEventListeners() {

    //delete spaces from code
    cpppCode.addEventListener("change", () => {
        cpppCode.value = cpppCode.value.replace(/\s+/g, '')
    })

    //complete full description
    const inputs = [cpppCode, cpppDescription, cpppFabric]
    inputs.forEach(input => {
        input.addEventListener("change", async(e) => {
            cpppFullDescription.value = cpppCode.value + ' - ' + cpppDescription.value  + ' - ' + cpppFabric.value
        })
    })

    // edit sizes
    cpppSizesIcon.addEventListener("click", () => {
        og.selectedSizes = [...og.newProductSizes]
        //complete sizes
        completeESPPsizes()
        esppError.style.display = 'none'
        espp.style.display = 'block'
    })

    //edit colors
    cpppColorsIcon.addEventListener("click", () => {
        og.selectedColors = [...og.newProductColors]
        //complete colors
        completeECPPcolors()
        ecpp.style.display = 'block'
    })

    // remove colors
    cpppRemoveColor.addEventListener("click", async() => {
        if (cpppRemoveColor.checked) {
            og.newProductColors = [],
            og.selectedColors = [],
            cpppColors.value = ''
        }
    })

    // create data popup events listeners
    const createIcons = [cpppNewType, cpppNewFabric, esppNewSize, ecppNewColor]
    createIcons.forEach(icon => {
        icon.addEventListener("click", async() => {
            og.createDataTypeSelected = og.createDataType.filter(dt => dt.icon == icon.id)[0]
            cdppTitle.innerText = og.createDataTypeSelected.popupTitle
            cdppDataLabel.innerText = og.createDataTypeSelected.popupLabel
            isValid([cdppData])
            clearInputs([cdppData])
            cdpp.style.display = 'block'
            cdppData.focus()
        })
    })

    // create product
    cpppCreate.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        let errors = inputsValidation(inputs)

        if (errors == 0) {
            errors = cpppValidations()
        }

        if (errors == 0) {

            ordersLoader.style.display = 'block'

            const data = {
                product:{
                    product_code:cpppCode.value,
                    id_products_types:og.productsTypes.filter(pt => (pt.product_type).toLowerCase() == cpppType.value.toLowerCase())[0].id,
                    description:cpppDescription.value,
                    id_fabrics:og.fabrics.filter(f => (f.fabric).toLowerCase() == cpppFabric.value.toLowerCase())[0].id,
                    full_description:cpppFullDescription.value,
                    unit_price:parseFloat(cpppPrice.value,2),
                    quantity:0,
                    sold_qty:0,
                    commited_qty:0,
                    stock:0,
                    season:og.season.season,
                    enabled:1
                },
                sizes:og.newProductSizes,
                colors:og.newProductColors
            }

            await fetch(dominio + 'apis/cuttings/products/create-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            og.products = await (await fetch(dominio + 'apis/cuttings/products/season-products/' + og.season.season)).json()
            selectProduct.value = data.product.full_description
            selectProduct.dispatchEvent(new Event('change'))
            ceoppReqQty.focus()

            cppp.style.display = 'none'
            ordersLoader.style.display = 'none'
            
        }
    })
}

export {cpppEventListeners}