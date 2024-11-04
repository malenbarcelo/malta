import og from "./globals.js"

//EDIT SIZES POPUP (ESPP)
async function esppEventListeners() {

    esppAccept.addEventListener("click", () => {
        if (og.selectedSizes.length == 0) {
            esppError.style.display = 'block'
        }else{
            esppError.style.display = 'none'
            og.newProductSizes = [...og.selectedSizes]
            cpppSizes.value =  og.newProductSizes.map(size => size.size).join(", ")
            espp.style.display = 'none'
        }
    })
}

export {esppEventListeners}