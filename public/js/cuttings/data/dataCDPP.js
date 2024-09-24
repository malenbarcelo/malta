import { dominio } from "../../dominio.js"
import dg from "./globals.js"
import { acceptWithEnter, inputsValidation, showOkPopup,isInvalid} from "../../generalFunctions.js"
import { showLoaders, uploadData,hideBodys } from "./functions.js"

//CREATE DATA POPUP (CDPP)
async function cdppEventListeners() {
    
    //accept
    cdppAccept.addEventListener("click", async() => {

        let  errors = inputsValidation([cdppData])
        
        if (errors == 0) {
            const allData = dg[dg.createDataTypeSelected.data]
            const findData = allData.filter( d => d[dg.createDataTypeSelected.attributeName] == cdppData.value)
            if (findData.length > 0) {
                errors += 1
                cdppDataError.innerText = 'El color ingresado ya existe'
                isInvalid([cdppData])
                cdppDataError.style.display = 'block'
            }
            
        }else{
            cdppDataError.innerText = 'Debe ingresar un dato'
        }

        
        if (errors == 0) {
            
            const data = {
                table:dg.createDataTypeSelected.table,
                data:cdppData.value
            }
    
            await fetch(dominio + 'apis/cuttings/data/create-data',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })
    
            hideBodys(dg.bodys)
            showLoaders(dg.loaders)
            uploadData()
            
            cdpp.style.display = 'none'
            showOkPopup(cdppOk)
        }


        
        

    })
    
    acceptWithEnter(cdppData,cdppAccept)
     
}

export {cdppEventListeners}