import pg from "./globals.js"

//EDIT SIZES POPUP (ESPP)
async function esppEventListeners() {

    esppAccept.addEventListener("click", () => {
        if (pg.selectedSizes.length == 0) {
            esppError.style.display = 'block'
        }else{
            esppError.style.display = 'none'
            if (pg.action == 'create') {
                pg.newProductSizes = [...pg.selectedSizes]
                cpppSizes.value =  pg.newProductSizes.map(size => size.size).join(", ")
            }else{
                cpppSizes.value =  pg.productSizes.map(size => size.size_data.size).join(", ")
            }
            espp.style.display = 'none'
        }
    })
}

export {esppEventListeners}