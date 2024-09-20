
import dg from "./globals.js"
import { showLoaders, uploadData } from "./functions.js"
import { showTableInfo, closePopupsEventListeners } from "../../generalFunctions.js"

//popups events listeners
import { cddppEventListeners } from "./dataCDDPP.js"

window.addEventListener('load',async()=>{

    //upload data
    uploadData()

    //show loaders
    dg.loaders = [productsTypesLoader, fabricsLoader, colorsLoader, sizesLoader]
    showLoaders(dg.loaders)

    //POPUPS EVENTS LISTENERS
    cddppEventListeners() //CONFIRM DELETE DATA POPUP (CDDPP)

    //table info events listeners
    const tableIcons = [
        {
            icon:eptppIcon,
            right:'71%'
        },
        {
            icon:dptppIcon,
            right:'68%'
        },
        {
            icon:efppIcon,
            right:'49%'
        },
        {
            icon:dfppIcon,
            right:'46%'
        },
        {
            icon:ecppIcon,
            right:'25.5%'
        },
        {
            icon:dcppIcon,
            right:'22.5%'
        },
        {
            icon:esppIcon,
            right:'8.5%'
        },
        {
            icon:dsppIcon,
            right:'5.5%'
        }
    ]

    showTableInfo(tableIcons,224,150)

    //close popups event listener
    const closePopups = [cddppClose,cddppCancel]
    closePopupsEventListeners(closePopups)

    
})
