
import dg from "./globals.js"
import { showLoaders, uploadData } from "./functions.js"
import { showTableInfo, closePopupsEventListeners,isValid,clearInputs } from "../../generalFunctions.js"

//popups events listeners
import { cddppEventListeners } from "./dataCDDPP.js"
import { cdppEventListeners } from "./dataCDPP.js"

window.addEventListener('load',async()=>{

    //upload data
    uploadData()

    //show loaders
    showLoaders(dg.loaders)

    //POPUPS EVENTS LISTENERS
    cddppEventListeners() //CONFIRM DELETE DATA POPUP (CDDPP)
    cdppEventListeners() //CREATE DATA POPUP (CDPP)

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
    const closePopups = [cddppClose,cddppCancel,cdppClose]
    closePopupsEventListeners(closePopups)

    //create data popup events listeners
    const createIcons = [createType, createFabric, createColor, createSize]
    createIcons.forEach(icon => {
        icon.addEventListener("click", async() => {
            dg.createDataTypeSelected = dg.createDataType.filter(dt => dt.icon == icon.id)[0]
            cdppTitle.innerText = dg.createDataTypeSelected.popupTitle
            cdppDataLabel.innerText = dg.createDataTypeSelected.popupLabel
            isValid([cdppData])
            clearInputs([cdppData])
            cdpp.style.display = 'block'
        })
    })
})
