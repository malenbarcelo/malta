import { dominio } from "../../dominio.js"
import sg from "../sales/salesGlobals.js"
import { dateToString } from "../../generalFunctions.js"

// async function printTableSales(dataToPrint) {

//     bodySales.innerHTML = ''
//     let counter = 0
//     let amount = 0

//     //printTable
//     dataToPrint.forEach(element => {

//         const date = dateToString(element.date)
//         const rowClass = counter % 2 == 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
//         const customer = element.orders_customers == null ? '' : element.orders_customers.customer_name
//         amount += parseFloat(element.total,2)
//         const deleteClass = element.id_sales_channels == 5 ? 'allowedIcon' : 'notAllowedIcon'
        
//         //print table
//         const line1 = '<th class="' + rowClass + '">' + element.order_number + '</th>'
//         const line2 = '<th class="' + rowClass + '">' + date + '</th>'
//         const line3 = '<th class="' + rowClass + '">' + element.orders_sales_channels.sales_channel + '</th>'
//         const line4 = '<th class="' + rowClass + '">' + customer + '</th>'
//         const line5 = '<th class="' + rowClass + '">' + sg.formatter.format(element.subtotal) + '</th>'
//         const line6 = '<th class="' + rowClass + '">' + element.discount * 100 + '%' + '</th>'
//         const line7 = '<th class="' + rowClass + '">' + sg.formatter.format(element.total) + '</th>'
//         const line8 = '<th class="' + rowClass + '"><i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="edit_' + element.id + '"></i></th>'
//         const line9 = '<th class="' + rowClass + '"><i class="fa-regular fa-trash-can ' + deleteClass + '" id="' + (deleteClass == 'allowedIcon' ? ('delete_' + element.id) : null) +'"></i></th>'

//         bodySales.innerHTML += '<tr>' + line1 + line2 + line3 + line4 + line5 + line6 + line7 + line8 + line9 + '</tr>'

//         counter += 1

//     })

//     //get main data
//     salesAmount.innerHTML = '<b>Total (ARS):</b> $' + sg.formatter.format(amount)
//     salesQty.innerHTML = '<b>Cantidad:</b> ' + dataToPrint.length

//     addSalesEventListeners(dataToPrint)
// }

async function printTableSales(dataToPrint) {
    // Limpiar el contenido existente del cuerpo de la tabla
    bodySales.innerHTML = '';

    // Inicializar contadores y variables de monto
    let counter = 0;
    let amount = 0;

    // Crear un DocumentFragment para insertar todas las filas de una vez
    const fragment = document.createDocumentFragment();

    // Recorrer los datos y construir las filas de la tabla
    dataToPrint.forEach(element => {
        const date = dateToString(element.date);
        const rowClass = counter % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd';
        const customer = element.orders_customers == null ? '' : element.orders_customers.customer_name;
        amount += parseFloat(element.total);

        const deleteClass = element.id_sales_channels == 5 ? 'allowedIcon' : 'notAllowedIcon';
        const deleteId = deleteClass === 'allowedIcon' ? `delete_${element.id}` : '';

        // Crear una fila de tabla usando una plantilla de cadena
        const row = document.createElement('tr');
        row.innerHTML = `
            <th class="${rowClass}">${element.order_number}</th>
            <th class="${rowClass}">${date}</th>
            <th class="${rowClass}">${element.orders_sales_channels.sales_channel}</th>
            <th class="${rowClass}">${customer}</th>
            <th class="${rowClass}">${sg.formatter.format(element.subtotal)}</th>
            <th class="${rowClass}">${element.discount * 100}%</th>
            <th class="${rowClass}">${sg.formatter.format(element.total)}</th>
            <th class="${rowClass}"><i class="fa-solid fa-magnifying-glass-plus allowedIcon" id="edit_${element.id}"></i></th>
            <th class="${rowClass}"><i class="fa-regular fa-trash-can ${deleteClass}" id="${deleteId}"></i></th>
        `;
        fragment.appendChild(row);

        counter += 1;
    });

    // Añadir el fragmento al cuerpo de la tabla
    bodySales.appendChild(fragment);

    // Actualizar el total de ventas y la cantidad de ventas
    salesAmount.innerHTML = `<b>Total (ARS):</b> $${sg.formatter.format(amount)}`;
    salesQty.innerHTML = `<b>Cantidad:</b> ${dataToPrint.length}`;

    // Añadir los event listeners a los elementos recién creados
    addSalesEventListeners(dataToPrint);
}

function addSalesEventListeners() {

    sg.sales.forEach(element => {

        const deleteSale = document.getElementById('delete_' + element.id)
        
        //delete sale
        if (deleteSale) {
            deleteSale.addEventListener('click',async()=>{
                sg.idSaleToDelete = element.id
                dsppQuestion.innerHTML = '¿Confirma que desea cancelar el pedido <b>N° ' + element.order_number + '</b> de Ninox </b>?'
                dspp.style.display = 'block'
            })
        }
    })
    
}

function filterSales() {

    sg.salesFiltered = sg.sales

    //orderNumber    
    sg.salesFiltered = filterOrder.value == '' ? sg.salesFiltered : sg.salesFiltered.filter(s => s.order_number == filterOrder.value)
    
    //customer
    const idCustomer = filterCustomer.value == '' ? '' :sg.customers.filter(s => s.customer_name == filterCustomer.value)[0].id
    sg.salesFiltered = filterCustomer.value == '' ? sg.salesFiltered : sg.salesFiltered.filter(s => s.id_customers == idCustomer)

    //sales-channel
    const idSalesChannels = filterSalesChannels.value == '' ? '' : sg.salesChannels.filter(sc => sc.id == filterSalesChannels.value)[0].id
    sg.salesFiltered = filterSalesChannels.value == '' ? sg.salesFiltered : sg.salesFiltered.filter(s => s.id_sales_channels == idSalesChannels)

    //month
    sg.salesFiltered = filterMonth.value == '' ? sg.salesFiltered : sg.salesFiltered.filter(s => parseInt(s.date.split('-')[1]) == filterMonth.value)

    //date
    sg.salesFiltered = filterDate.value == '' ? sg.salesFiltered : sg.salesFiltered.filter(s => s.date == filterDate.value)

}


export {printTableSales,filterSales}