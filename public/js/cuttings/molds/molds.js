
// popups events listeners
import { cemppEventListeners } from "./moldsCEMPP.js"

window.addEventListener('load',async()=>{

    loader.style.display = 'block'

    

    // popups events listeners
    cemppEventListeners() // cretae edit mold popup (cempp)

    // crate mold
    DGAcreate.addEventListener("click", async() => {
        
    })

    //loader.style.display = 'none'
})
