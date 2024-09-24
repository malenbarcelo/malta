import { dominio } from "../../dominio.js"
import dg from "./globals.js"
import { showOkPopup } from "../../generalFunctions.js"
import { showLoaders, uploadData,hideBodys } from "./functions.js"
//CONFIRM DELETE DATA POPUP (CDDPP)
async function cddppEventListeners() {
    
    //accept
    cddppAccept.addEventListener("click", async() => {
        const data = {
            id:dg.idElementToEdit,
            table:dg.tableToEdit
        }

        await fetch(dominio + 'apis/cuttings/data/delete-data',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(data)
        })

        hideBodys()
        showLoaders()
        uploadData()
        
        cddpp.style.display = 'none'
        showOkPopup(cddppOk)

    })     
     
}

export {cddppEventListeners}