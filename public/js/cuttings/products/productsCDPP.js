import { dominio } from "../../dominio.js"
import pg from "./globals.js"
import { acceptWithEnter, inputsValidation, showOkPopup,isInvalid} from "../../generalFunctions.js"
import { getData,completeESPPsizes,completeECPPcolors } from "./functions.js"

//CREATE DATA POPUP (CDPP)
async function cdppEventListeners() {
    
    //accept
    cdppAccept.addEventListener("click", async() => {

        let  errors = inputsValidation([cdppData])
        
        if (errors == 0) {
            const allData = pg[pg.createDataTypeSelected.data]
            
            const findData = allData.filter( d => (d[pg.createDataTypeSelected.attributeName]).toLowerCase() == (cdppData.value).toLowerCase())

            if (findData.length > 0) {
                errors += 1
                cdppDataError.innerText = pg.createDataTypeSelected.error
                isInvalid([cdppData])
                cdppDataError.style.display = 'block'
            }
            
        }else{
            cdppDataError.innerText = 'Debe ingresar un dato'
        }
        
        if (errors == 0) {
            
            const data = {
                table:pg.createDataTypeSelected.table,
                data:cdppData.value
            }
    
            await fetch(dominio + 'apis/cuttings/data/create-data',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
    
            productsLoader.style.display = 'block'
            await getData()

            if (pg.createDataTypeSelected.data == 'productsTypes' || pg.createDataTypeSelected.data == 'fabrics') {
                pg.createDataTypeSelected.input.value = cdppData.value
                pg.createDataTypeSelected.input.dispatchEvent(new Event('change'))
            }

            if (pg.createDataTypeSelected.data == 'sizes') {
                const newSize = pg.sizes.filter(s => s.size == cdppData.value)[0]
                pg.newProductSizes.push(newSize)
                cpppSizesIcon.dispatchEvent(new Event('click'))
            }

            if (pg.createDataTypeSelected.data == 'colors') {
                const newColor = pg.colors.filter(c => c.color == cdppData.value)[0]
                pg.newProductColors.push(newColor)
                cpppColorsIcon.dispatchEvent(new Event('click'))
            }
            
            cdpp.style.display = 'none'
            productsLoader.style.display = 'none'
        }

    })
    
    acceptWithEnter(cdppData,cdppAccept)
     
}

export {cdppEventListeners}