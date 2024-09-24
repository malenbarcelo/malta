import pg from "./globals.js"

//EDIT SIZES POPUP (ESPP)
async function esppEventListeners() {

    esppAccept.addEventListener("click", () => {
        if (pg.selectedSizes.length == 0) {
            esppError.style.display = 'block'
        }else{
            esppError.style.display = 'none'
            pg.newProductSizes = [...pg.selectedSizes]
            cpppSizes.value =  pg.newProductSizes.map(size => size.size).join(", ")
            espp.style.display = 'none'
        }
    })

    

    
    
     
}

export {esppEventListeners}