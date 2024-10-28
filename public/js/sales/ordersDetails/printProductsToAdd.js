import { dominio } from "../../dominio.js"
import odg from "./globals.js"

function printProductsToAdd() {

    bodyAddProducts.innerHTML = '';
    let counter = 0;
    const fragment = document.createDocumentFragment();

    odg.productsToAdd.forEach(element => {
        element.products.forEach(product => {
            if (product.enabled != 0) {

                const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';

                const row = document.createElement('tr');

                const thCustomer = document.createElement('th');
                thCustomer.className = rowClass;
                thCustomer.textContent = element.customer.customer_name;

                const thDescription = document.createElement('th');
                thDescription.className = rowClass;
                thDescription.textContent = product.full_description;

                const thColor = document.createElement('th');
                thColor.className = rowClass;
                thColor.textContent = product.product_colors.map(c => c.color_data.color).join(', ')

                const thSize = document.createElement('th');
                thSize.className = rowClass;
                thSize.textContent = product.product_sizes.map(s => s.size_data.size).join(', ')

                const thDelete = document.createElement('th');
                thDelete.className = rowClass;
                const deleteIcon = document.createElement('i');
                deleteIcon.className = 'fa-regular fa-trash-can allowedIcon';
                deleteIcon.id = `delete_${element.id}_${product.id}`;
                thDelete.appendChild(deleteIcon);

                row.appendChild(thCustomer);
                row.appendChild(thDescription);
                row.appendChild(thColor);
                row.appendChild(thSize);
                row.appendChild(thDelete);

                fragment.appendChild(row);

                counter += 1;
            }
        });
    });

    bodyAddProducts.appendChild(fragment);

    productsToAddEventListeners();
}

function productsToAddEventListeners() {

    odg.productsToAdd.forEach(element => {
        element.products.forEach(product => {
            const deleteLine = document.getElementById('delete_' + element.id + '_' + product.id)

            //delete line
            if (deleteLine) {
                deleteLine.addEventListener('click',async()=>{

                    odg.productsToAdd = odg.productsToAdd.map(item => {
                        if (item.id == element.id) {
                            item.products = item.products.map(product2 => {
                                if (product2.id === product.id) {
                                    return { ...product2, enabled: 0 };
                                }
                                return product2
                            })
                        }
                        return item
                    })

                    printProductsToAdd()
                })
            }        
            
        })
    })
}

export {printProductsToAdd}