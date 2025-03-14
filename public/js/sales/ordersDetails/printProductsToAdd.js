import g from "./globals2.js"

function printProductsToAdd() {

    bodyAddProducts.innerHTML = '';
    let counter = 0;
    const fragment = document.createDocumentFragment();

    g.productsToAdd.forEach(element => {

        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';

        const row = document.createElement('tr');
        row.id = `tr_${element.row_id}`

        const thCustomer = document.createElement('th');
        thCustomer.className = rowClass;
        thCustomer.textContent = element.customer_name;

        const thDescription = document.createElement('th');
        thDescription.className = rowClass;
        thDescription.textContent = element.description;

        const thReqQty = document.createElement('th');
        thReqQty.className = rowClass;
        thReqQty.textContent = element.required_quantity;

        const thColor = document.createElement('th');
        thColor.className = rowClass;
        thColor.textContent = element.colors.map(c => c.color_data.color).join(', ')

        const thSize = document.createElement('th');
        thSize.className = rowClass;
        thSize.textContent = element.sizes.map(s => s.size_data.size).join(', ')

        const thEdit = document.createElement('th');
        thEdit.className = rowClass;
        const editIcon = document.createElement('i');
        editIcon.className = 'fa-regular fa-pen-to-square allowedIcon';
        editIcon.id = `edit_${element.row_id}`;
        thEdit.appendChild(editIcon);

        const thDelete = document.createElement('th');
        thDelete.className = rowClass;
        const deleteIcon = document.createElement('i');
        deleteIcon.className = 'fa-regular fa-trash-can allowedIcon';
        deleteIcon.id = `delete_${element.row_id}`;
        thDelete.appendChild(deleteIcon);

        row.appendChild(thCustomer);
        row.appendChild(thDescription);
        row.appendChild(thReqQty);
        row.appendChild(thColor);
        row.appendChild(thSize);
        row.appendChild(thEdit);
        row.appendChild(thDelete);

        fragment.appendChild(row);

        counter += 1;
    });

    bodyAddProducts.appendChild(fragment);

    productsToAddEventListeners();
}

function productsToAddEventListeners() {

    g.productsToAdd.forEach(element => {
        const deleteLine = document.getElementById('delete_' + element.row_id)
        const editLine = document.getElementById('edit_' + element.row_id)
        const tr = document.getElementById('tr_' + element.row_id)

        //delete line
        deleteLine.addEventListener('click',async()=>{
            g.productsToAdd = g.productsToAdd.filter( p => p.row_id != element.row_id)
            printProductsToAdd()
        })

        //edit required quantity
        editLine.addEventListener('click',async()=>{
            g.rowToEdit = element.row_id
            erqppQty.value = element.required_quantity
            erqpp.style.display = 'block'
            erqppQty.focus()
        })

        //edit with double click
        tr.addEventListener('dblclick',async()=>{
            editLine.click()
        })
    })
}

export {printProductsToAdd}