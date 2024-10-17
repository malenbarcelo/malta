import odg from "./globals.js"

//EDIT PRODUCT SIZES POPUP (EPSPP)
function elsppEventListeners() {

    //close
    elsppClose.addEventListener("click", async() => {
        odg.selectedSizes = [...odg.productSizes]
    })

    //accept change sizes
    elsppAccept.addEventListener("click", async() => {

        if (odg.selectedSizes.length == 0) {
            elsppError.style.display = 'block'
        }else{
            elsppError.style.display = 'none'
            const sizes = (odg.selectedSizes.map(s => s.size_data.size)).join(', ')
            elppSizes.value = sizes
            elspp.style.display = 'none'
        }
    })
}

export { elsppEventListeners }