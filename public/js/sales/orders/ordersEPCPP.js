import og from "./globals.js"

//EDIT PRODUCT COLORS POPUP (EPCPP)
function epcppEventListeners() {

    //close
    epcppClose.addEventListener("click", async() => {
        og.selectedColors = [...og.productColors]
    })

    //accept change colors
    epcppAccept.addEventListener("click", async() => {

        if (og.selectedColors.length == 0) {
            epcppError.style.display = 'block'
        }else{
            epcppError.style.display = 'none'
            const colors = (og.selectedColors.map(c => c.color_data.color)).join(', ')
            ceoppColors.innerHTML = '<b>COLORES: </b>' + colors
            eodppColors.innerText = colors
            epcpp.style.display = 'none'
        }
    })
}

export { epcppEventListeners }