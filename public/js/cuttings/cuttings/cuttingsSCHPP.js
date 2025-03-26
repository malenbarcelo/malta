import { f } from "./functions.js"

// save changes popup (schpp)
async function schppEventListeners() {

    // close    
    schppClose.addEventListener("click", async() => {
        schpp.style.display = 'none'
    })

    // no    
    schppNo.addEventListener("click", async() => {
        f.restablishSelectedCuttings()
        schpp.style.display = 'none'
        celpp.style.display = 'none'
    })

    // yes
    schppYes.addEventListener("click", async() => {
        schpp.style.display = 'none'
        celppSave.click()
    })
}

export { schppEventListeners }