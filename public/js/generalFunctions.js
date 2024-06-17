import { dominio } from "./dominio.js"

function clearInputs(inputs) {

    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.value = ''
        label.classList.remove('errorColor')
        error.style.display = 'none'
        input.classList.remove('isInvalid')
    })
}

function inputsValidation(inputs) {
    let errors = 0
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        if (input.value == '') {
            errors +=1            
            label.classList.add('errorColor')
            error.style.display = 'block'
            input.classList.add('isInvalid')
        }else{
            label.classList.remove('errorColor')
            error.style.display = 'none'
            input.classList.remove('isInvalid')
        }
    })
    return errors
}

function dateToString(date) {

    const dateAsArray = date.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '-' + month + '-' + year

    return stringDate    
}

function showOkPopup(popupToShow) {

    popupToShow.style.display = 'block'

    //hide okPopup after one second
    setTimeout(function() {
        popupToShow.style.display = 'none'
    }, 1500)
    
}

export {clearInputs,inputsValidation,dateToString,showOkPopup}