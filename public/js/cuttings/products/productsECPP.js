import pg from "./globals.js"

//EDIT COLORS POPUP (ECPP)
async function ecppEventListeners() {

    ecppAccept.addEventListener("click", () => {
        if (pg.selectedColors.length == 0) {
            ecppError.style.display = 'block'
        }else{
            ecppError.style.display = 'none'
            pg.newProductColors = [...pg.selectedColors]
            cpppColors.value =  pg.newProductColors.map(color => color.color).join(", ")
            ecpp.style.display = 'none'
        }
    })
}

export {ecppEventListeners}