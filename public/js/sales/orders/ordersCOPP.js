import og from "./globals.js"
import { dominio } from "../../dominio.js"
import { printCustomerMovements, updateCustomerData } from "./functions.js"

// confirm popup (copp)
function coppEventListeners() {

    coppAccept.addEventListener("click", async() => {
        
        if (og.coppAction == 'destroyMovement') {

            ordersLoader.style.display = 'block'
            copp.style.display = 'none'

            const data = {id_payments: og.elementToUpdate.id}

            const response = await fetch(dominio + 'apis/delete/payments-assignations',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            const message = await response.json()

            if (message.message == 'ok') {

                const data =  {id: og.elementToUpdate.id}
                const response = await fetch(dominio + 'apis/delete/payments',{
                    method:'POST',
                    headers: {'Content-Type': 'application/json'},
                    body: JSON.stringify(data)
                })

                const message = await response.json()

                if (message.message == 'ok') {
                    const findCustomer = og.customers.filter( c => c.customer_name == filterCustomer.value)
                    const customerMovements = await (await fetch(dominio + 'apis/sales/customers/customer-movements/' + findCustomer[0].id)).json()
                    printCustomerMovements(customerMovements)
                    await updateCustomerData()
                    cmppBalance.innerHTML = og.customerData[0].positiveBalance >= 0 ? 'Saldo a favor: $ ' + og.formatter.format(og.customerData[0].positiveBalance) : 'Saldo en contra: $ ' + og.formatter.format(og.customerData[0].positiveBalance)
                }else{
                    console.log('error')
                }
                
                ordersLoader.style.display = 'none'

            }else{
                console.log('error')
            }

        }
    })
}

export {coppEventListeners}