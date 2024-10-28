import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { dateToString } from "../../generalFunctions.js"

// function printTableAddProducts(dataToPrint) {

//     bodyAddProducts.innerHTML = ''
//     let counter = 0
//     const fragment = document.createDocumentFragment()

//     dataToPrint.forEach(element => {
//         element.products.forEach(product => {
//             if (product.enabled != 0) {
                
//                 const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        
//                 const row = document.createElement('tr')

//                 row.innerHTML = `
//                     <th class="${rowClass}">${element.customer.customer_name}</th>
//                     <th class="${rowClass}">${product.description}</th>
//                     <th class="${rowClass}">${product.color}</th>
//                     <th class="${rowClass}">${product.size}</th>
//                     <th class="${rowClass}"><i class="fa-regular fa-trash-can allowedIcon" id="delete_${element.id}_${product.id}"></i></th>
//                 `;
//                 fragment.appendChild(row)

//                 counter += 1
//             }                        
//         })        
//     })

//     bodyAddProducts.appendChild(fragment)

//     addProductsEventListeners(dataToPrint)
// }



export {printTableOrdersDetails,filterOrdersDetails,printTableAddProducts}