import { dominio } from "./dominio.js"

function clearData(inputs, selects, errorText, body) {

    //inputs
    if (inputs != undefined) {
        inputs.forEach(input => {
            input.value = ''
            const inputLabel = document.getElementById(input.name + 'Label')
            input.classList.remove('isInvalid')
            inputLabel.classList.remove('errorColor')        
        })
    }

    //selects
    if (selects != undefined) {
        selects.forEach(select => {
            const defaultOption = document.getElementById(select.name + 'Default')
            const selectLabel = document.getElementById(select.name + 'Label')
            defaultOption.selected = true
            select.classList.remove('isInvalid')
            selectLabel.classList.remove('errorColor')            
        })
    }

    //error texts
    errorText.classList.add('notVisible')

    //bodys    
    body.innerHTML = ''

    
}

function isInvalid(errorLabel, input) {
    errorLabel.classList.add('errorColor')
    input.classList.add('isInvalid')
}

function isValid(errorLabel, input) {
    errorLabel.classList.remove('errorColor')
    input.classList.remove('isInvalid')    
}

function dateToString(date) {

    const dateAsArray = date.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '-' + month + '-' + year

    return stringDate    
}

export {isValid,isInvalid,clearData,dateToString}