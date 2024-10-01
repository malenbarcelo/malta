import pg from "./globals.js"
import { dominio } from "../../dominio.js"
import { inputsValidation, showOkPopup,isValid, clearInputs } from "../../generalFunctions.js"
import { completeESPPsizes,completeECPPcolors, getData } from "./functions.js"
import { printProducts } from "./printProducts.js"
import { applyFilters } from "./filters.js"

//CREATE PRODUCTS POPUP (CPPP)
async function cpppEventListeners() {

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

    //create product
    cpppCreate.addEventListener("click", async() => {
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

            productsLoader.style.display = 'block'
            bodyProducts.innerHTML = ''
            cppp.style.display = 'none'
            await getData()
            printProducts()
            applyFilters()

            cpppOkText.innerText = 'Producto creado con éxito'
            showOkPopup(cpppOk)
            
        }
    })

    //edit product
    cpppEdit.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        let errors = inputsValidation(inputs)

        if (errors == 0) {
            const data = {
                idProduct: pg.idProductToEdit,
                productData:{
                    id_products_types:pg.productsTypes.filter(pt => pt.product_type == cpppType.value)[0].id,
                    description:cpppDescription.value,
                    id_fabrics:pg.fabrics.filter(f => f.fabric == cpppFabric.value)[0].id,
                    full_description:cpppFullDescription.value,
                    unit_price:parseFloat(cpppPrice.value,2)
                },
                sizes:pg.productSizes,
                colors:pg.productColors
            }

            await fetch(dominio + 'apis/cuttings/products/edit-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            productsLoader.style.display = 'block'
            bodyProducts.innerHTML = ''
            cppp.style.display = 'none'
            await getData()
            printProducts()
            applyFilters()
            
            cpppOkText.innerText = 'Producto editado con éxito'
            showOkPopup(cpppOk)
            
        }
    })

    //create data popup events listeners
    const createIcons = [cpppNewType, cpppNewFabric, esppNewSize, ecppNewColor]
    createIcons.forEach(icon => {
        icon.addEventListener("click", async() => {
            pg.createDataTypeSelected = pg.createDataType.filter(dt => dt.icon == icon.id)[0]
            cdppTitle.innerText = pg.createDataTypeSelected.popupTitle
            cdppDataLabel.innerText = pg.createDataTypeSelected.popupLabel
            isValid([cdppData])
            clearInputs([cdppData])
            cdpp.style.display = 'block'
        })
    })
}

export {cpppEventListeners}