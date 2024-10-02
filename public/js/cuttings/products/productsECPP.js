import pg from "./globals.js"

//EDIT COLORS POPUP (ECPP)
async function ecppEventListeners() {

    ecppAccept.addEventListener("click", () => {
        if (pg.action == 'create') {
            pg.newProductColors = [...pg.selectedColors]
            cpppColors.value =  pg.newProductColors.map(color => color.color).join(", ")
        }else{
            cpppColors.value =  pg.productColors.map(color => color.color_data.color).join(", ")
        }

        cpppRemoveColor.checked = false
        ecpp.style.display = 'none'
    })
}

export {ecppEventListeners}