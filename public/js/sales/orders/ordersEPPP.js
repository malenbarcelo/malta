import { dominio } from "../../dominio.js"
import og from "./globals.js"
import { isInvalid, isValid, ignoreDoubleClick } from "../../generalFunctions.js"
import { printCustomerMovements,updateCustomerData } from "./functions.js"

// edit payment popup (eppp)
function epppEventListeners() {

    epppAccept.addEventListener("click", async() => {

        // ignore double click
        if (ignoreDoubleClick(1200)) {
            return
        }

        //validations
        const errors = validations()

        if (errors == 0) {

            let responseStatus1
            let responseStatus2
            
            eppp.style.display = 'none'
            loader1.style.display = 'block'

            //get date
            let date = new Date(epppDate.value)
            date = date.setHours(date.getHours() + 3)
            
            const data = [{
                id:og.paymentToEdit.id,
                date: date,
                amount: epppAmount.value
            }]

            const response = await fetch(dominio + 'apis/update/sales-payments',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus1 = await response.json()

            if (responseStatus1.message == 'ok') {

                const data = [{
                    id_payments:og.paymentToEdit.id,
                    date: date,
                    amount: epppAmount.value
                }]

                const response = await fetch(dominio + 'apis/update/sales-payments-assignations',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                responseStatus2 = await response.json()
                
            }

            if (responseStatus1.message == 'ok' && responseStatus2.message == 'ok'){
                const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
                const customerMovements = await (await fetch(dominio + 'apis/sales/customers/customer-movements/' + findCustomer[0].id)).json()
                printCustomerMovements(customerMovements)
                await updateCustomerData()
                cmppBalance.innerHTML = og.customerData[0].positiveBalance >= 0 ? 'Saldo a favor: $ ' + og.formatter.format(og.customerData[0].positiveBalance) : 'Saldo en contra: $ ' + og.formatter.format(og.customerData[0].positiveBalance)
                
            }else{
                console.log('error')
            }

            loader1.style.display = 'none'
        }

    })

}

function validations() {

    let errors = 0

    if (epppDate.value == '') {
        errors +=1
        isInvalid([epppDate])
    }else{
        isValid([epppDate])
    }

    if (epppAmount.value == '' || epppAmount.value < 0) {
        errors +=1
        isInvalid([epppAmount])
    }else{
        isValid([epppAmount])
    }

    return errors
    
}

export {epppEventListeners}