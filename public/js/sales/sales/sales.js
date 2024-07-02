import { dominio } from "../../dominio.js"
import sg from "./salesGlobals.js"
import { printTableSales } from "./salesFunctions.js"

window.addEventListener('load',async()=>{

    //get data and complete globals
    const year = (new Date()).getFullYear()

    salesLoader.style.display = 'block'
    sg.sales = await (await fetch(dominio + 'apis/sales/consolidated-sales/' + year)).json()
    salesLoader.style.display = 'none'

    //print table
    printTableSales(sg.sales)


    //table info events listeners    
    voppIcon.addEventListener("mouseover", async(e) => {
        const mouseX = e.clientX
        voppInfo.style.left = (mouseX - 100) + 'px'
        voppInfo.style.display = 'block'
    })

    voppIcon.addEventListener("mouseout", async(e) => {
        voppInfo.style.display = 'none'
    })

})