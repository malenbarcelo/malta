import g from "./globals.js"
import { f } from "./functions.js"

window.addEventListener('load',async()=>{

    // show loader
    loader.style.display = 'block'

    // get data
    await f.getData()

    // select order manager
    f.selectOrderManager()
    g.filters.id_orders_managers = g.userLogged


    // hide loader
    loader.style.display = 'none'

})
