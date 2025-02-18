import { dominio } from "../../dominio.js"
import g from "./globals2.js"
import { applyFilters, getData } from "./functions.js"
import { f } from "./functions2.js"
import { showOkPopup, getDate } from "../../generalFunctions.js"
import { printProductsToAdd } from "./printProductsToAdd.js"
import { printDetails } from "./printDetails2.js"

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
                const productToAdd = g.products.rows.filter(p => p.full_description == apppProduct.value)
                const customer = g.customers.filter(c => c.customer_name.trim() == apppCustomer.value.trim())
                if (productToAdd.length == 0) {
                    apppError.innerText = 'Producto inválido'
                    apppError.style.display = 'block'
                }else{
                    if (customer.length == 0) {
                        apppError.innerText = 'Cliente inválido'
                        apppError.style.display = 'block'
                    }else{
                        const id = g.productsToAdd.length == 0 ? 1 : Math.max(...g.productsToAdd.map(element => element.row_id)) + 1
                        g.customersProductsToAdd.push(customer[0])
                        g.productsToAdd.push({
                            extended_price: 0,
                            id_customers:customer[0].id,
                            customer_name:customer[0].customer_name,
                            id_products:productToAdd[0].id,
                            description:productToAdd[0].full_description,
                            unit_price:productToAdd[0].unit_price,
                            colors:productToAdd[0].product_colors.length == 0 ? [{color_data:{color:'U'}}] : productToAdd[0].product_colors,
                            sizes:productToAdd[0].product_sizes,
                            required_quantity: '',
                            enabled:1,
                            row_id:id
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

        let responseStatus1
        let responseStatus2
        let responseStatus3
        let responseStatus4
        let responseStatus5

        const date = getDate(new Date())

        ordersDetailsLoader.style.display = 'block'
        appp.style.display = 'none'
        bodyOrdersDetails.innerHTML = ''

        const data = g.productsToAdd
        const customers = g.customersProductsToAdd.filter((obj, index, self) =>
            index === self.findIndex((el) => el.id === obj.id)
        )
        const customersIds = customers.map( c => c.id)

        //findout if there are orders to create
        const lastOrders = await (await fetch(`${dominio}apis/composed/last-orders?customers=[${customersIds}]`)).json()
        const lastOrdersCustomers = new Set(lastOrders.map(item => item.id_customers))
        const ordersToCreate = customers.filter(c => !lastOrdersCustomers.has(c.id))

        // create orders if applies
        if (ordersToCreate.length > 0) {
            const maxOrderNumber = await (await fetch(`${dominio}apis/composed/max-order-number`)).json()
            const orderNumber = maxOrderNumber + 1
            const data = []

            ordersToCreate.forEach((o,index) => {

                const idOrdersManagers = g.userLogged == 'Pedro' ? 5 : (g.userLogged == 'Esteban' ? 4 : (g.userLogged == 'Antonio' ? 2 : 3))

                data.push({
                    date: date,
                    order_number: orderNumber + index,
                    id_customers:o.id,
                    id_sales_channels: o.id_sales_channels,
                    total: 0,
                    subtotal: 0,
                    discount: o.discount,
                    id_orders_status: 1,
                    id_payments_status: 3,
                    id_orders_managers: idOrdersManagers,
                    season: g.season.season,
                    enabled:1
                })
            })

            //create orders
            const response1 = await fetch(dominio + 'apis/create/sales-orders',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus1 = await response1.json()

        }

        // update orders if applies
        if (lastOrders.length > 0) {
            const data = []

            lastOrders.forEach((o) => {
                data.push({
                    id: o.id_orders,
                    id_orders_status: 1,
                    id_payments_status: o.id_payments_status == 3 ? 3 : 4
                })
            })

            //update orders
            const response2 = await fetch(dominio + 'apis/update/sales-orders',{
                method:'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(data)
            })

            responseStatus2 = await response2.json()

        }

        // create orders details
        const newLastOrders = await (await fetch(`${dominio}apis/composed/last-orders?customers=[${customersIds}]`)).json()

        g.productsToAdd = g.productsToAdd.map(product => ({
            ...product,
            date:date,
            id_orders: newLastOrders.filter( lo => lo.id_customers == product.id_customers)[0].id_orders
        }))

        const response3 = await fetch(dominio + 'apis/create/sales-orders-details',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(g.productsToAdd)
        })

        responseStatus3 = await response3.json()

        // create colors and sizes
        const createdData = responseStatus3.data

        const colorsToCreate = []
        const sizesToCreate = []

        createdData.forEach(d => {
            // find profuct
            const product = g.products.rows.find(p => p.id === d.id_products)

            if (product) {
                product.product_colors.forEach(c => {
                    colorsToCreate.push({
                        id_orders_details: d.id,
                        id_colors: c.id_colors
                    })
                })

                product.product_sizes.forEach(s => {
                    sizesToCreate.push({
                        id_orders_details: d.id,
                        id_sizes: s.id_sizes
                    })
                })
            }
        })

        //create colors
        const response4 = await fetch(dominio + 'apis/create/sales-orders-details-colors',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(colorsToCreate)
        })

        responseStatus4 = await response4.json()

        //create size
        const response5 = await fetch(dominio + 'apis/create/sales-orders-details-sizes',{
            method:'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(sizesToCreate)
        })

        responseStatus5 = await response5.json()
        
        //update scroll data
        g.loadedPages = new Set()
        g.previousScrollTop = 0

        //get and print data
        g.details = await f.getDetails()
        printDetails()

        ordersDetailsTable.scrollTop = 0

        if ((!responseStatus1 || responseStatus1.message == 'ok') && (!responseStatus2 || responseStatus2.message == 'ok') && responseStatus3.message == 'ok' && responseStatus4.message == 'ok' && responseStatus5.message == 'ok') {
            okText.innerText = 'Productos agregados con éxito'
            showOkPopup(okPopup)
        }else{
            errorText.innerText = 'Error al agregar productos'
            showOkPopup(errorPopup)
        }

        ordersDetailsLoader.style.display = 'none'
    })

    // edit required quantity
    erqppAccept.addEventListener("click", async(e) => {

        ordersDetailsLoader.style.display = 'block'

        erqpp.style.display = 'none'

        const row = g.productsToAdd.find(p => p.row_id === g.rowToEdit)
        row.required_quantity = erqppQty.value

        printProductsToAdd()

        ordersDetailsLoader.style.display = 'none'

    })
}

export {apppEventListeners}