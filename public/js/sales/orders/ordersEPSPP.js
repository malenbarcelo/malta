import og from "./globals.js"

//EDIT PRODUCT SIZES POPUP (EPSPP)
function epsppEventListeners() {

    //close
    epsppClose.addEventListener("click", async() => {
        og.selectedSizes = [...og.productSizes]
    })

    //accept change sizes
    epsppAccept.addEventListener("click", async() => {

        if (og.selectedSizes.length == 0) {
            epsppError.style.display = 'block'
        }else{
            epsppError.style.display = 'none'
            const sizes = (og.selectedSizes.map(s => s.size_data.size)).join(', ')
            ceoppSizes.innerHTML = '<b>TALLES: </b>' + sizes
            epspp.style.display = 'none'
        }
    })
}

export { epsppEventListeners }