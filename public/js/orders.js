import { dominio } from "./dominio.js"
//import { clearData, isValid, isInvalid } from "./functions/generalDataFuntions.js"

window.addEventListener('load',async()=>{

    //orders.ejs
    const createEditOrder = document.getElementById('createEditOrder')


    //ordersCreateEdit.ejs
    const createEditPopup = document.getElementById('createEditPopup')
    const closeCreateEditPopup = document.getElementById('closeCreateEditPopup')

    
    
    
    
    
    

    /*----------------------------orders.ejs-----------------------------*/
    createEditOrder.addEventListener("click", () => {
        //clear data
        //clearData(inputs,errors,labels,selects)

        //show popup
        createEditPopup.classList.add('slideIn')

    })

    closeCreateEditPopup.addEventListener("click", () => {
        createEditPopup.classList.remove('slideIn')

    })

})