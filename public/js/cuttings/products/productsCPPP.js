import pg from "./globals.js"
import { dominio } from "../../dominio.js"
import { inputsValidation, showOkPopup,isValid, clearInputs, isInvalid } from "../../generalFunctions.js"
import { completeESPPsizes,completeECPPcolors, getData,cpppValidations } from "./functions.js"
import { printProducts } from "./printProducts.js"
import { applyFilters } from "./filters.js"

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
            cpppFullDescription.value = cpppCode.value.trim() + ' - ' + cpppDescription.value.trim()  + ' - ' + cpppFabric.value.trim()
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
        ecpp.style.display = 'block'
    })

    //create product
    cpppCreate.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        let errors = inputsValidation(inputs)

        if (errors == 0) {
            errors = await cpppValidations()
        }

        if (errors == 0) {
            productsLoader.style.display = 'block'
            const data = {
                product:{
                    product_code:cpppCode.value.trim(),
                    id_products_types:pg.productsTypes.filter(pt => pt.product_type == cpppType.value)[0].id,
                    description:cpppDescription.value.trim(),
                    id_fabrics:pg.fabrics.filter(f => f.fabric == cpppFabric.value)[0].id,
                    full_description:cpppFullDescription.value,
                    unit_price:parseFloat(cpppPrice.value,2),
                    quantity:0,
                    sold_qty:0,
                    commited_qty:0,
                    stock:0,
                    season:pg.currentSeason.season,
                    enabled:1
                },
                sizes:pg.newProductSizes,
                colors:pg.newProductColors
            }

            const response = await fetch(dominio + 'apis/cuttings/products/create-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const responseData = await response.json()
                
            bodyProducts.innerHTML = ''
            cppp.style.display = 'none'
            await getData()
            unfilter.click()
            printProducts()
            okppText.innerText = 'Producto creado con éxito'
            showOkPopup(okpp)

            productsLoader.style.display = 'none'

        }
    })

    //edit product
    cpppEdit.addEventListener("click", async() => {
        const inputs = [cpppCode,cpppDescription,cpppType,cpppFabric,cpppPrice]
        let errors = inputsValidation(inputs)

        if (errors == 0) {
            errors = await cpppValidations()
        }

        if (errors == 0) {
            const data = {
                idProduct: pg.idProductToEdit,
                productData:{
                    product_code: cpppCode.value,
                    id_products_types:pg.productsTypes.filter(pt => pt.product_type == cpppType.value)[0].id,
                    description:cpppDescription.value,
                    id_fabrics:pg.fabrics.filter(f => f.fabric == cpppFabric.value)[0].id,
                    full_description:cpppFullDescription.value,
                    unit_price:parseFloat(cpppPrice.value,2)
                },
                sizes:pg.productSizes,
                colors:pg.productColors
            }

            //edit product
            await fetch(dominio + 'apis/cuttings/products/edit-product',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //update orders data if appliers
            const oldPrice = parseFloat(pg.products.filter(p => p.id == pg.idProductToEdit)[0].unit_price,2)
            const newPrice = parseFloat(data.productData.unit_price,2)

            if (oldPrice != newPrice) {
                const data = {
                    id_product: pg.idProductToEdit,
                    unit_price: newPrice
                }

                //edit orders details
                await fetch(dominio + 'apis/sales/orders/edit-orders-details/unit-price',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })
            }

            productsLoader.style.display = 'block'
            bodyProducts.innerHTML = ''
            cppp.style.display = 'none'
            await getData()
            applyFilters()
            printProducts()
            
            okppText.innerText = 'Producto editado con éxito'
            showOkPopup(okpp)
            
        }
    })

    //remove colors
    cpppRemoveColor.addEventListener("click", async() => {
        if (cpppRemoveColor.checked) {
            pg.newProductColors = [],
            pg.productColors = []
            pg.selectedColors = [],
            cpppColors.value = ''
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
            cdppData.focus()
        })
    })
}

export {cpppEventListeners}