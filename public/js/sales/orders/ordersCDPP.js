import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { inputsValidation, isInvalid} from "../../generalFunctions.js"

//CREATE DATA POPUP (CDPP)
async function cdppEventListeners() {
    
    //accept
    cdppAccept.addEventListener("click", async() => {

        let  errors = inputsValidation([cdppData])
        
        if (errors == 0) {
            const allData = og[og.createDataTypeSelected.data]
            
            const findData = allData.filter( d => (d[og.createDataTypeSelected.attributeName]).toLowerCase() == (cdppData.value).toLowerCase())

            if (findData.length > 0) {
                errors += 1
                cdppDataError.innerText = og.createDataTypeSelected.error
                isInvalid([cdppData])
                cdppDataError.style.display = 'block'
            }
            
        }else{
            cdppDataError.innerText = 'Debe ingresar un dato'
        }
        
        if (errors == 0) {
            
            const data = {
                table:og.createDataTypeSelected.table,
                data:cdppData.value
            }

            ordersLoader.style.display = 'block'
    
            await fetch(dominio + 'apis/cuttings/data/create-data',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
    
            if (og.createDataTypeSelected.data == 'productsTypes' || og.createDataTypeSelected.data == 'fabrics') {
                og.createDataTypeSelected.input.value = cdppData.value
                og.productsTypes = await (await fetch(dominio + 'apis/cuttings/data/products-types')).json()
                og.fabrics = await (await fetch(dominio + 'apis/cuttings/data/fabrics')).json()
                og.createDataTypeSelected.input.dispatchEvent(new Event('change'))
            }

            if (og.createDataTypeSelected.data == 'sizes') {
                og.sizes = await (await fetch(dominio + 'apis/cuttings/data/sizes')).json()
                const newSize = og.sizes.filter(s => s.size == cdppData.value)[0]
                og.newProductSizes.push(newSize)
                cpppSizesIcon.dispatchEvent(new Event('click'))
            }

            if (og.createDataTypeSelected.data == 'colors') {
                og.colors = await (await fetch(dominio + 'apis/cuttings/data/colors')).json()
                const newColor = og.colors.filter(c => c.color == cdppData.value)[0]
                og.newProductColors.push(newColor)
                cpppColorsIcon.dispatchEvent(new Event('click'))
            }
            
            cdpp.style.display = 'none'
            ordersLoader.style.display = 'none'
        }

    })
}

export {cdppEventListeners}