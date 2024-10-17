import odg from "./globals.js"

//EDIT LINE COLORS POPUP (ELCPP)
function elcppEventListeners() {

    //close
    elcppClose.addEventListener("click", async() => {
        odg.selectedColors = [...odg.productColors]
    })

    //accept change colors
    elcppAccept.addEventListener("click", async() => {

        if (odg.selectedColors.length == 0) {
            elcppError.style.display = 'block'
        }else{
            elcppError.style.display = 'none'
            const colors = (odg.selectedColors.map(c => c.color_data.color)).join(', ')
            elppColors.innerText = colors
            elcpp.style.display = 'none'
        }
    })
}

export { elcppEventListeners }