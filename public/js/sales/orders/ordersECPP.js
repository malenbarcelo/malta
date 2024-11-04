import og from "./globals.js"

//EDIT COLORS POPUP (ECPP)
async function ecppEventListeners() {

    ecppAccept.addEventListener("click", () => {
       
        og.newProductColors = [...og.selectedColors]
        cpppColors.value =  og.newProductColors.map(color => color.color).join(", ")
        cpppRemoveColor.checked = false
        ecpp.style.display = 'none'
    })
}

export {ecppEventListeners}