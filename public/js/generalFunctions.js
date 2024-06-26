import { dominio } from "./dominio.js"
import g from "./globals.js"

function clearInputs(inputs) {

    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.value = ''
        if (label) {
            label.classList.remove('errorColor')
        }
        if (error) {
            error.style.display = 'none'
        }        
        
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

async function predictElements(input,list,apiUrl,name,elementName) {
    if (input.value.length >= 3) {

        let id = 0
        
        const string = input.value.toLowerCase()
        g.predictedElements = await (await fetch(dominio + apiUrl + string)).json()

        list.innerHTML = ''

        g.predictedElements.forEach(element => {
            list.innerHTML += '<li class="liPredictedElements" id="' + elementName + '_'+ id +'">' + element[name] + '</li>'
            id += 1
        })

        g.focusedElement = -1

        if (g.predictedElements.length > 0) {
            list.style.display = 'block'
            
            for (let i = 0; i < g.predictedElements.length; i++) {

                const element = document.getElementById(elementName + '_' + i)
                
                element.addEventListener("mouseover", async() => {

                    //unfocus all elements
                    for (let j = 0; j < g.predictedElements.length; j++) {
                        const element = document.getElementById(elementName + '_' + j)
                        if (j == i) {
                            element.classList.add('predictedElementFocused')
                        }else{
                            element.classList.remove('predictedElementFocused')
                        }                            
                    }
                })
                
                element.addEventListener("click", async() => {
                    input.value = element.innerText
                    list.style.display = 'none'                      
                })
            }
        }

    }else{
        list.style.display = 'none'
        list.innerHTML = ''
    }
}

function selectFocusedElement(e,input,list,elementName) {
    if (e.key === 'ArrowDown' && g.predictedElements.length > 0) {
            
        g.focusedElement = (g.focusedElement == g.predictedElements.length-1) ? g.focusedElement : (g.focusedElement + 1)            
        
        g.elementToFocus = document.getElementById(elementName + '_' + g.focusedElement)            
        g.elementToFocus.classList.add('predictedElementFocused')
        g.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (g.focusedElement > 0) {
            g.elementToUnfocus = document.getElementById(elementName + '_' + (g.focusedElement-1))
            g.elementToUnfocus.classList.remove('predictedElementFocused')                
        }

    }else if(e.key === 'ArrowUp'){

        g.focusedElement = (g.focusedElement == 0) ? g.focusedElement : (g.focusedElement - 1)

        g.elementToFocus = document.getElementById(elementName + '_' + g.focusedElement)            
        g.elementToFocus.classList.add('predictedElementFocused')
        g.elementToFocus.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest'
        })

        if (g.focusedElement != -1) {
            g.elementToUnfocus = document.getElementById(elementName + '_' + (g.focusedElement + 1))
            g.elementToUnfocus.classList.remove('predictedElementFocused')                
        }
        
    }else if(e.key === 'Enter'){

        if (g.productFocused == -1) {
            input.value = ''
        }else{
            input.value = g.elementToFocus.innerText
        }
        
        list.style.display = 'none'
    }else if(e.key === 'Escape'){
        g.focusedElement = -1
        input.value = ''
        list.style.display = 'none'

    }
}

export {clearInputs,inputsValidation,dateToString,showOkPopup,predictElements,selectFocusedElement}