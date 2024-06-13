import { dominio } from "./dominio.js"
import globals from "./ordersGlobals.js"
import { isValid, isInvalid, clearData, dateToString } from "./generalFunctions.js"

async function productSelected(selectedProduct) {

    selectProduct.value = selectedProduct
    selectSize.innerHTML = '<option value="default" id="selectSizeDefault" selected></option>'
        
    const productOptions = await (await fetch(dominio + 'apis/cuttings/product-options/' + selectProduct.value)).json()

    productOptions.sizes.forEach(size => {
        selectSize.innerHTML += '<option value=' + size + '>' + size +'</option>'        
    })

    predictedProductsList.style.display = 'none'
    
    //hide colors row
    colorsRow.classList.add('notVisible')
    hideColorsInputs()
    
}

async function getColorsOptions() {

    const selectedProduct = selectProduct.value
    const selectedSize = selectSize.value

    if (selectedProduct != 'default' && selectedSize != 'default') {
        const colorsOptions = await (await fetch(dominio + 'apis/cuttings/colors-options/' + selectedProduct + '/' + selectedSize)).json()
        
        //hide colors inputs
        hideColorsInputs()

        //show inputs
        for (let i = 0; i < colorsOptions.colors.length; i++) {
            const inputToShow = document.getElementById('inputColor' + i)
            const labelToShow = document.getElementById('color' + i + 'Label')            
            inputToShow.classList.remove('notVisible')
            labelToShow.innerText = colorsOptions.colors[i]
        }

        //show colors row
        colorsRow.classList.remove('notVisible')

    }else{
        colorsRow.classList.add('notVisible')
    }
}

function hideColorsInputs() {
    for (let i = 0; i < 8; i++) {
        const inputToHide = document.getElementById('inputColor' + i)
        const labelToHide = document.getElementById('color' + i + 'Label')
        inputToHide.classList.add('notVisible')
        labelToHide.innerText = ''
    }
}



function updateOrderDetails(products) {

    const filterProduct = products.filter(p => p.description == selectProduct.value && p.color == selectColor.value && p.size == selectSize.value)[0]

    const id = globals.orderDetails.length == 0 ? 1 : Math.max(...globals.orderDetails.map(element => element.id)) + 1

    globals.orderDetails.push({
        'id': id,
        'id_products':filterProduct ? filterProduct.id : null,
        'description':selectProduct.value,
        'color':selectColor.value,
        'size':selectSize.value,        
        'unit_price':filterProduct ? parseFloat(filterProduct.unit_price,2) : 0,
        'quantity':quantity.value == '' ? 0 : parseInt(quantity.value),
        'extended_price':filterProduct ? parseFloat(filterProduct.unit_price,2) * parseInt(quantity.value) : 0,
        'rowStatus': (!filterProduct || quantity.value == '') ? 'Incompleto' : 'Completo'
    })
}

function updateOrderData() {

    globals.orderData.subtotal = 0

    globals.orderDetails.forEach(element => {
        globals.orderData.subtotal += element.extended_price
        globals.orderData.total = globals.orderData.subtotal * (1-globals.orderData.discount)        
    })

    orderInfo.innerHTML = ''
    orderInfo.innerHTML += '<div><b>Subtotal:</b> $' + globals.orderData.subtotal +'</div>'
    orderInfo.innerHTML += '<div><b>Descuento:</b> ' + globals.orderData.discount * 100 + '%</div>'
    orderInfo.innerHTML += '<div><b>Total:</b> $' + globals.orderData.total + '</div>'

}

function printTableCreateEdit() {

    bodyCreateEdit.innerHTML = ''

    let counter = 0

    //printTable
    globals.orderDetails.forEach(element => {

        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'

        const description = element.description == 'default' ? '' : element.description
        const color = element.color == 'default' ? '' : element.color
        const size = element.size == 'default' ? '' : element.size
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + description + '</th>'
        const line2 = '<th class="' + rowClass + '">' + color + '</th>'
        const line3 = '<th class="' + rowClass + '">' + size + '</th>'        
        const line4 = '<th class="' + rowClass + '">' + element.unit_price + '</th>'
        const line5 = '<th class="' + rowClass + '">' + element.quantity + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.extended_price + '</th>'
        const line7 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square bodyIcon" id="edit_' + element.id + '"></th>'
        const line8 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can bodyIcon" id="delete_' + element.id + '"></th>'

        bodyCreateEdit.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + '</tr>'

        counter += 1

    })

    addEventListeners()
    
}

function addEventListeners() {

    globals.orderDetails.forEach(element => {

        const editRow = document.getElementById('edit_' + element.id)
        const deleteRow = document.getElementById('delete_' + element.id)

        //delete
        deleteRow.addEventListener('click',async()=>{
            globals.orderDetails = globals.orderDetails.filter(data => data.id !== element.id)
            updateOrderData()
            printTableCreateEdit()
        })

        //edit
        editRow.addEventListener('click',async()=>{

            const productData = globals.orderDetails.filter(product => product.id == element.id)[0]
            const inputs2 = [editPrice,editQty]

            titleEditPopup.innerHTML = productData.product + ' - ' + productData.color + ' - ' + productData.size
            orderDetailsId.innerText = element.id
            editPrice.value = element.unit_price
            editQty.value = element.quantity

            //clear errors
            inputs2.forEach(input => {
                const inputName = input.name
                const errorLabel = document.querySelector(`#${inputName}Label`)
                isValid(errorLabel,input)
            })
            errorText2.classList.add('notVisible')

            //show popup
            editPopup.style.display = 'block'

        })

    })
    
}

function printTableOrders(ordersToPrint,customers) {

    const formatter = new Intl.NumberFormat('es-ES', {
        minimumFractionDigits: 0,
        useGrouping: true
    })
    
    bodyOrders.innerHTML = ''

    let counter = 0

    //printTable
    ordersToPrint.forEach(element => {

        const customer = customers.filter(c => c.id == element.id_customers)[0].customer_name
        const date = dateToString(element.date)
        const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
        //print table
        const line1 = '<th class="' + rowClass + '">' + element.order_number + '</th>'
        const line2 = '<th class="' + rowClass + '">' + date + '</th>'
        const line3 = '<th class="' + rowClass + '">' + element.sales_channel + '</th>'        
        const line4 = '<th class="' + rowClass + '">' + customer + '</th>'
        const line5 = '<th class="' + rowClass + '">' + formatter.format(element.subtotal) + '</th>'
        const line6 = '<th class="' + rowClass + '">' + element.discount * 100 + '%' + '</th>'
        const line7 = '<th class="' + rowClass + '">' + formatter.format(element.total) + '</th>'
        const line8 = '<th class="' + rowClass + '">' + formatter.format(element.balance) + '</th>'
        const line9 = '<th class="' + rowClass + '">' + element.status + '</th>'
        const line10 = '<th class="' + rowClass + '">' + element.order_manager + '</th>'
        const line11 = '<th class="' + rowClass + '"><i class="fa-regular fa-pen-to-square bodyIcon" id="edit_' + element.id + '"></th>'
        const line12 = '<th class="' + rowClass + '"><i class="fa-regular fa-credit-card bodyIcon" id="payment_' + element.id + '"></th>'
        const line13 = '<th class="' + rowClass + '"><i class="fa-solid fa-truck-ramp-box bodyIcon" id="deliver_' + element.id + '"></th>'
        const line15 = '<th class="' + rowClass + '"><i class="fa-solid fa-ban bodyIcon" id="cancel_' + element.id + '"></th>'

        bodyOrders.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + line10 + line11 + line12 + line13 + line15 + '</tr>'

        counter += 1

    })

    addEventListeners()
    
}

export {productSelected, getColorsOptions, hideColorsInputs, updateOrderData, updateOrderDetails, printTableCreateEdit, printTableOrders}