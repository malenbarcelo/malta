import { dominio } from "./dominio.js"
import g from "./globals.js"
let eventListenersRefs = {}

function clearInputs(inputs) {

    inputs.forEach(input => {

        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.value = ''

        if (label) {
            label.classList.remove('errorColor')
            label.classList.remove('invalidLabel')
        }

        if (error) {
            error.style.display = 'none'
        }        
        
        input.classList.remove('isInvalid')
        input.classList.remove('invalidInput')
    })
}

function inputsValidation(inputs) {
    let errors = 0
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        if (input.value == '') {
            errors +=1            
            label.classList.add('invalidLabel')
            error.style.display = 'block'
            input.classList.add('invalidInput')
        }else{
            label.classList.remove('invalidLabel')
            error.style.display = 'none'
            input.classList.remove('invalidInput')
        }
    })
    return errors
}

function isValid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.remove('invalidInput')
        if (label) {
            label.classList.remove('invalidLabel')
        }
        if (error) {
            error.style.display = 'none'
        }
        
    })    
}

function isInvalid(inputs) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.add('invalidInput')
        if (label) {
            label.classList.add('invalidLabel')
        }
        if (error) {
            error.style.display = 'block'
        }
        
    })    
}

function notValid(inputs, errorText) {
    inputs.forEach(input => {
        const label = document.getElementById(input.id + 'Label')
        const error = document.getElementById(input.id + 'Error')
        input.classList.add('invalidInput')
        if (label) {
            label.classList.add('invalidLabel')
        }
        if (error) {
            error.innerText = errorText
            error.style.display = 'block'
        }        
    })    
}

function dateToString(date) {

    const dateAsArray = date.split('-')

    const year = dateAsArray[0]
    const month = dateAsArray[1]
    const day = dateAsArray[2]
    
    const stringDate = day + '-' + month + '-' + year

    return stringDate    
}

async function applyPredictElement(elementsToPredict) {

    // Eliminar listeners previos si existen
    elementsToPredict.forEach((element, index) => {
        if (eventListenersRefs[index]) {
            const { input, inputHandler, keydownHandler } = eventListenersRefs[index]
            input.removeEventListener("input", inputHandler)
            input.removeEventListener("keydown", keydownHandler)
        }
    })

    // Crear nuevos event listeners
    elementsToPredict.forEach((element, index) => {
        const { input, list, apiUrl, name, elementName } = element

        const inputHandler = async (e) => {
            predictElements(input, list, apiUrl, name, elementName)
        }

        const keydownHandler = async (e) => {
            selectFocusedElement(e, input, list, elementName)
        }

        // Guardar referencias para eliminarlos más adelante
        eventListenersRefs[index] = { input, inputHandler, keydownHandler }

        // Asignar los nuevos event listeners
        input.addEventListener("input", inputHandler)
        input.addEventListener("keydown", keydownHandler)
    })

    // for (let i = 0; i < elementsToPredict.length; i++) {
        
    //     const input = elementsToPredict[i].input
    //     const list = elementsToPredict[i].list
    //     const apiUrl = elementsToPredict[i].apiUrl
    //     const name = elementsToPredict[i].name
    //     const elementName = elementsToPredict[i].elementName

    //     input.addEventListener("input", async(e) => {
    //         predictElements(input,list,apiUrl,name,elementName)
    //     })

    //     input.addEventListener("keydown", async(e) => {
    //         selectFocusedElement(e,input,list,elementName)
    //     })
    // }
}

async function predictElements(input,list,apiUrl,dataToPrint,elementName) {

    if (input.value.length >= 2) {

        let id = 0
        
        const string = input.value.toLowerCase()
        g.predictedElements = await (await fetch(dominio + apiUrl + string)).json()

        list.innerHTML = ''

        g.predictedElements.forEach(element => {
            list.innerHTML += '<li class="liPredictedElements" id="' + elementName + '_'+ id +'">' + element[dataToPrint] + '</li>'
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
                    const event = new Event('change')
                    input.dispatchEvent(event)
                    list.style.display = 'none'
                })
            }
        }

    }else{
        list.style.display = 'none'
        list.innerHTML = ''
    }
}

function selectWithClick(e,dataToSelect) {
    let clickPredictedElement = false
    let inputToClick
    dataToSelect.forEach(element => {
        const input = element.input
        const name = element.name        
        const findeElement = g.predictedElements.filter(p => p[name] == e.target.innerText)
        if (findeElement.length > 0) {
            input.value = e.target.innerText
            clickPredictedElement = true
            inputToClick = input
        }
    })
    return {clickPredictedElement,inputToClick}
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

        if (g.elementToFocus != null) {
            g.elementToFocus.classList.add('predictedElementFocused')
            g.elementToFocus.scrollIntoView({
                behavior: 'smooth',
                block: 'nearest'
            })  
        }
        
        if (g.focusedElement != -1 && g.focusedElement != null) {
            g.elementToUnfocus = document.getElementById(elementName + '_' + (g.focusedElement + 1))
            if (g.elementToUnfocus != null) {
                g.elementToUnfocus.classList.remove('predictedElementFocused')
            }
        }
        
    }else if(e.key === 'Enter'){
        if (g.focusedElement != -1 && g.elementToFocus != null) {
            input.value = g.elementToFocus.innerText
        }
        list.style.display = 'none'
        g.focusedElement = -1

        input.dispatchEvent(new Event('change'))

        setTimeout(() => {
            list.style.display = 'none'
        }, 300)
        
        //handleEnter(input,list)
    }else if(e.key === 'Escape'){
        g.focusedElement = -1
        input.value = ''
        list.style.display = 'none'
    }

    input.addEventListener('blur', function() {
        setTimeout(() => {
            list.style.display = 'none'
        }, 300)
        //handleEnter(input, list)
    })
}

function handleEnter(input, list) {
    if (list.style.display == 'block') {
        if (g.focusedElement == -1) {
        } else {
            input.value = g.elementToFocus ? g.elementToFocus.innerText : input.value

        }
        list.style.display = 'none'
    }
}

function closePopupsEventListeners(closePopups) {
    closePopups.forEach(element => {
        element.addEventListener("click", async() => {
            let popupToClose = document.getElementById(element.id.replace('Close',''))
            popupToClose = document.getElementById(popupToClose.id.replace('Cancel',''))
            popupToClose.style.display = 'none'
        })
    })
}

function acceptWithEnterInput(input,button) {
    input.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            button.click()
        }
    })
}

function acceptWithEnterPopup(popup,button) {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && popup.style.display == 'block') {
            button.click()
        }
    })
}

function showTableInfo(tableIcons,top,width) {
    tableIcons.forEach(element => {
        const info = document.getElementById(element.icon.id.replace('Icon','Info'))
        element.icon.addEventListener("mouseover", async(e) => {
            info.style.top = top + 'px'
            info.style.right = element.right
            
            info.style.width = width + 'px'
            info.style.display = 'block'
        })
        element.icon.addEventListener("mouseout", async(e) => {
            info.style.display = 'none'
        })
    })
}

function clearFilters(filters) {
    filters.forEach(filter => {
        filter.value = ''
    })
}

function showOkPopup(popupToShow) {

    popupToShow.classList.add('okSlideIn')

    //hide okPopup after one second
    setTimeout(function() {
        popupToShow.classList.remove('okSlideIn')
    }, 2000)
    
}

function closePopups(popups) {
    popups.forEach(popup => {
        const closeIcon = document.getElementById(popup.id + 'Close')
        const cancelIcon = document.getElementById(popup.id + 'Cancel')
        if (closeIcon) {
            closeIcon.addEventListener("click", async() => {
                if (popup.style.display == 'block') {
                    popup.style.display = 'none'
                }else{
                    popup.classList.remove('slideIn')
                }
            })
        }
        if (cancelIcon) {
            cancelIcon.addEventListener("click", async() => {
                if (popup.style.display == 'block') {
                    popup.style.display = 'none'
                }else{
                    popup.classList.remove('slideIn')
                }
            })
        }
        
    })
}

function closeWithEscape(popups) {
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            const displayedPopups = popups.filter(p => p.style.display == 'block' || p.classList.contains('slideIn'))
            if (displayedPopups.length > 0) {
                if (displayedPopups[0].style.display == 'block') {
                    displayedPopups[0].style.display = 'none'
                }else{
                    displayedPopups[0].classList.remove('slideIn')
                }
            }
        }
    })
}

function focusInputs(inputsToFocus) {
    inputsToFocus.forEach(input => {
        input.addEventListener('focus', () => {
            input.classList.add('i-focused')
        })
    
        input.addEventListener('blur', () => {
            input.classList.remove('i-focused')
        })
    })
}

function ignoreDoubleClick(time) {

    const now = new Date().getTime()

        if (now - g.lastClickTime < time) {
            return  true // Ignore double click
        }

        g.lastClickTime = now

        return false
}

function getDate(date) {

    let formattedDate = new Date(date)
    formattedDate = date.setHours(date.getHours() + 3)

    return formattedDate
}

function validations(input,validations) {

    let errors = 0

    // isEmpty
    const isEmpty = validations.filter( v => v.validation == 'isEmpty')

    if (isEmpty.length > 0 && input.value == '') {
        errors += 1
        notValid([input],isEmpty[0].text)
        return errors
    }

    // isEmail
    const isEmail = validations.filter( v => v.validation == 'isEmail')

    if (isEmail.length > 0) {
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        const validateEmail = emailPattern.test(input.value)
        if (!validateEmail) {
            errors += 1
            this.notValid([input],isEmail[0].text)
            return errors
        }
    }

    // isPassword
    const isPassword = validations.filter( v => v.validation == 'isPassword')

    if (isPassword.length > 0 && input.value.length < 4) {
        errors += 1
        notValid([input],isPassword[0].text)
        return errors
    }

    // existingData
    const existingData = validations.filter( v => v.validation == 'existingData')

    if (existingData.length > 0 && existingData[0].result) {
        errors += 1
        notValid([input],existingData[0].text)
        return errors
    }

    // notExistingData
    const notExistingData = validations.filter( v => v.validation == 'notExistingData')

    if (notExistingData.length > 0 && !notExistingData[0].result) {
        errors += 1
        notValid([input],notExistingData[0].text)
        return errors
    }

    // fileExtensions
    const fileExtensions = validations.find( v => v.validation == 'fileExtensions')

    if (fileExtensions) {
        const fileName = input.files[0].name
        const fileExtension = fileName.split('.').pop().toLowerCase()

        if (!fileExtensions.allowedExtensions.includes(fileExtension)) {
            errors += 1
            notValid([input],fileExtensions.text)
            return errors
        }
    }

    //validate input
    if (errors == 0) {
        isValid([input])
    }

    return errors
    
}



export {clearInputs,inputsValidation,isValid,dateToString,showOkPopup,predictElements,selectFocusedElement,closePopupsEventListeners,acceptWithEnterInput,acceptWithEnterPopup,showTableInfo, clearFilters,selectWithClick,isInvalid,applyPredictElement,closeWithEscape,closePopups,focusInputs,ignoreDoubleClick, getDate, validations}