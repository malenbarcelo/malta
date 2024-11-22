import og from "./globals.js"
import { dominio } from "../../dominio.js"
import { updateOrderData} from "./functions.js"
import { clearInputs } from "../../generalFunctions.js"

async function printOrderDetails() {

    ceoppBody.innerHTML = ''; 

    let rows = ''; 

    og.orderDetails.forEach((element, index) => {
        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        const sizes = (element.sizes.map(s => s.size_data.size)).join(', ')
        const colors = (element.colors.map(c => c.color_data.color)).join(', ')
        const comments = (element.observations2 == '' || element.observations2 == null) ? '<i class="fa-regular fa-comment pointer" id="observations_' + element.id + '"></i>' : '<i class="fa-regular fa-comment-dots pointer" id="observations_' + element.id + '"></i>'

        rows += `
            <tr>
                <th class="${rowClass}">${element.description}</th>
                <th class="${rowClass}">${og.formatter.format(element.unit_price)}</th>
                <th class="${rowClass}">${element.required_quantity == null ? '' : element.required_quantity }</th>
                <th class="${rowClass}">${element.confirmed_quantity == null ? '' : element.confirmed_quantity }</th>
                <th class="${rowClass}">${og.formatter.format(element.extended_price)}</th>
                <th class="${rowClass}">${sizes}</th>
                <th class="${rowClass}">${colors}</th>
                <th class="${rowClass}">${comments}</th>
                <th class="${rowClass}"><i class="fa-regular fa-pen-to-square allowedIcon" id="edit_${element.id}"></i></th>
                <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}"></i></th>
            </tr>
        `;
    });

    ceoppBody.innerHTML = rows;

    ordersDetailsEventListeners()
}

function ordersDetailsEventListeners() {

    og.orderDetails.forEach(element => {

        const deleteRow = document.getElementById('delete_' + element.id)
        const editRow = document.getElementById('edit_' + element.id)
        const observations = document.getElementById('observations_' + element.id)
        
        //delete
        if (deleteRow) {
            deleteRow.addEventListener('click',async()=>{
                og.orderDetails = og.orderDetails.filter(data => data.id !== element.id)
                updateOrderData()
                printOrderDetails()
            })
        }

        //edit
        if (editRow) {
            editRow.addEventListener('click',async()=>{
                const productData = og.orderDetails.filter(product => product.id == element.id)[0]    
                eodppTitle.innerText = productData.description    
                //clear errors
                clearInputs([eodppPrice])    
                eodppPrice.value = element.unit_price
                eodppQtyR.value = element.required_quantity
                eodppQtyC.value = element.confirmed_quantity                
                og.idOrderDetailsToEdit = productData.id
                
                //complete sizes
                const sizes = (element.sizes.map(s => s.size_data.size)).join(', ')
                eodppSizes.value = sizes
                og.productSizes = element.product_data.product_sizes
                og.selectedSizes = element.sizes  
                if (element.product_data.product_sizes[0].size_data.size == 'U') {
                    eodppChangeSizes.style.display = 'none'
                }else{
                    eodppChangeSizes.style.display = 'flex'
                }
                
                //complete colors
                const colors = (element.colors.map(c => c.color_data.color)).join(', ')
                og.productColors = element.product_data.product_colors
                og.selectedColors = element.colors                
                eodppColors.innerText = element.product_data.product_colors.length == 0 ? 'U' : colors
                if (element.product_data.product_colors.length == 0) {
                    eodppChangeColors.style.display = 'none'
                }else{
                    eodppChangeColors.style.display = 'flex'
                }
                
                //show popup
                eodpp.style.display = 'block'    
            })
        }

        //observations
        observations.addEventListener('click',async()=>{
            og.idOrderDetailsToEdit = element.id
            oloppObs.value = element.observations2
            oloppProduct.innerText = element.product_data.full_description
            olopp.style.display = 'block'
        })

    })
}


export { printOrderDetails }