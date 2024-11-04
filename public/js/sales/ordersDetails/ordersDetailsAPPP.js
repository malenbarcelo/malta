import { dominio } from "../../dominio.js"
import odg from "./globals.js"
import { getData } from "./functions.js"
import { showOkPopup } from "../../generalFunctions.js"
import { printProductsToAdd } from "./printProductsToAdd.js"


//ADD PRODUCT POPUP (APPP)
function apppEventListeners() {
    
    const inputs = [apppProduct, apppCustomer]

    //add products
    apppAddLine.addEventListener("click", async(e) => {
        if (apppProduct.value == '' && apppCustomer.value == '') {
            apppError.innerText = 'Debe completar producto y cliente'
            apppError.style.display = 'block'
        }else{
            if (apppProduct.value != '' && apppCustomer.value != '') {
                const productsToAdd = odg.products.filter(p => p.full_description == apppProduct.value)
                const customer = odg.customers.filter(c => c.customer_name == apppCustomer.value)

                if (productsToAdd.length == 0) {
                    apppError.innerText = 'Producto inválido'
                    apppError.style.display = 'block'
                }else{
                    if (customer.length == 0) {
                        apppError.innerText = 'Cliente inválido'
                        apppError.style.display = 'block'
                    }else{
                        const id = odg.productsToAdd.length == 0 ? 1 : Math.max(...odg.productsToAdd.map(element => element.id)) + 1
                        odg.productsToAdd.push({
                            'id':id,
                            'customer':customer[0],
                            'season':odg.season.season,
                            'products':productsToAdd
                        })
                        printProductsToAdd()
                        apppCustomer.value = ''
                        apppError.style.display = 'none'
                    }
                }
            }
        }
        
    })

    //save
    apppAccept.addEventListener("click", async(e) => {

        const data = odg.productsToAdd
        odg.createOrder = false

        //find out if there are orders to create
        let ordersToCreate = 0
        data.forEach(element => {
            const customerOrders = odg.orders.filter( o => o.id_customers == element.customer.id)
            if (customerOrders.length == 0) {
                ordersToCreate +=1
                odg.createOrder = true
                element.createOrder = true
            }else{
                element.createOrder = false
            }
        })

        if (ordersToCreate > 0 && odg.salesChannel == 0) {
            sscpp.style.display = 'block'
        }else{
            
            data.forEach(element => {
                if (element.createOrder == true) {
                    element.id_sales_channels = parseInt(odg.salesChannel)
                }
            })

            await fetch(dominio + 'apis/sales/add-products',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            //get data
            ordersDetailsLoader.style.display = 'block'
            await getData()

            appp.style.display = 'none'
            okppText.innerText = 'Producto agregado con éxito'
            showOkPopup(okpp)
        }
    })

    sscppAccept.addEventListener("click", async(e) => {
        odg.salesChannel = sscppSalesChannel.value
        sscpp.style.display = 'none'
        apppAccept.click()
    })
}

export {apppEventListeners}