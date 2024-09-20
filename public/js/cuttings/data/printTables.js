import dg from "./globals.js"

function printTable(dataToPrint,table,data,tableTitle) {

    const loader = document.getElementById(table + 'Loader')
    const body = document.getElementById(table + 'Body')
    loader.style.display = 'block'
    body.innerHTML = ''
    let html = ''

    dataToPrint.forEach((element,index) => {

        const rowClass = index % 2 === 0 ? 'tBody1 tBodyEven' : 'tBody1 tBodyOdd'
        const attribute = element[data]
        const editIcon = '<i class="fa-regular fa-pen-to-square allowedIcon" id="' + table +'Edit_'+ element.id +'"></i>'
        const deleteIcon = '<i class="fa-regular fa-trash-can allowedIcon" id="' + table +'Delete_'+ element.id +'"></i>'

        html += `
            <tr>
                <th class="${rowClass}">${attribute}</th>
                <th class="${rowClass}">${editIcon}</th>
                <th class="${rowClass}">${deleteIcon}</th>
            </tr>
            `
        body.innerHTML = html

    })

    addEventsListeners(dataToPrint,table,data,tableTitle)

    loader.style.display = 'none'
}

function addEventsListeners(dataToPrint,table,data,tableTitle) {

    dataToPrint.forEach(element => {

        const editIcon = document.getElementById(table + 'Edit_' + element.id)
        const deleteIcon = document.getElementById(table + 'Delete_' + element.id)

        //delete
        deleteIcon.addEventListener('click',async()=>{

            dg.idElementToEdit = element.id
            dg.tableToEdit = table
            dg.tableTitle = tableTitle

            cddppQuestion.innerHTML = '¿Confirma que desea eliminar "' + element[data] + '" de la tabla <b>' + tableTitle + '</b>?'

            cddpp.style.display = 'block'
        })

        
    })
}

export {printTable}