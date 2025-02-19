
import dg from "./globals.js"
import { showLoaders, uploadData } from "./functions.js"
import { showTableInfo, closePopups,closeWithEscape,isValid,clearInputs } from "../../generalFunctions.js"

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
            right:'-4%'
        },
        {
            icon:dptppIcon,
            right:'-19%'
        },
        {
            icon:efppIcon,
            right:'2%'
        },
        {
            icon:dfppIcon,
            right:'-12%'
        },
        {
            icon:ecppIcon,
            right:'2%'
        },
        {
            icon:dcppIcon,
            right:'-12%'
        },
        {
            icon:esppIcon,
            right:'-2%'
        },
        {
            icon:dsppIcon,
            right:'-25%'
        }
    ]

    showTableInfo(tableIcons,24,150)

    //close popups event listener
    closePopups(dg.popups)

    //close with escape
    closeWithEscape(dg.popups)

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
            cdppData.focus()
        })
    })
})
