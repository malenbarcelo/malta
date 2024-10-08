import og from "./globals.js"

function printOrderDetails() {

    ceoppBody.innerHTML = ''

    let counter = 0

    //printTable
    // og.orderDetails.forEach(element => {

    //     const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

    //     //print table
    //     const line1 = '<th class="' + rowClass + '">' + element.description + '</th>'
    //     const line2 = '<th class="' + rowClass + '">' + element.color + '</th>'
    //     const line3 = '<th class="' + rowClass + '">' + element.size + '</th>'        
    //     const line4 = '<th class="' + rowClass + '">' + og.formatter.format(element.unit_price) + '</th>'
    //     const line5 = '<th class="' + rowClass + '">' + (element.required_quantity == null ? '' : element.required_quantity) + '</th>'
    //     const line6 = '<th class="' + rowClass + '">' + (element.confirmed_quantity == null ? '' : element.confirmed_quantity) + '</th>'
    //     const line7 = '<th class="' + rowClass + '">' + og.formatter.format(element.extended_price) + '</th>'
    //     const line8 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_' + element.id + '"></th>'
    //     const line9 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can allowedIcon" id="delete_' + element.id + '"></th>'

    //     bodyCreateEdit.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + '</tr>'

    //     counter += 1
        

    // })

    //addCreateEditEventListeners()
    
}

function addCreateEditEventListeners() {

    og.orderDetails.forEach(element => {

        const deleteRow = document.getElementById('delete_' + element.id)
        const editRow = document.getElementById('edit_' + element.id)
        
        //delete
        if (deleteRow) {
            deleteRow.addEventListener('click',async()=>{
                og.orderDetails = og.orderDetails.filter(data => data.id !== element.id)
                updateOrderData()
                printTableCreateEdit()
            })
        }
        

        //edit
        if (editRow) {
            editRow.addEventListener('click',async()=>{
                const productData = og.orderDetails.filter(product => product.id == element.id)[0]    
                eodppTitle.innerText = productData.description + ' - ' + productData.color + ' - ' + productData.size    
                //clear errors
                clearInputs([eodppPrice])    
                eodppPrice.value = element.unit_price
                eodppQtyR.value = element.required_quantity
                eodppQtyC.value = element.confirmed_quantity                
                og.idOrderDetailsToEdit = productData.id    
                //show popup
                eodpp.style.display = 'block'    
            })
        }
    })
}


export { printOrderDetails }