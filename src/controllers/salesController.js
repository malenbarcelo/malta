const customersQueries = require('./dbQueries/customersQueries')
const ordersManagersQueries = require('./dbQueries/ordersManagersQueries')
const ordersStatusQueries = require('./dbQueries/ordersStatusQueries')

const bottomHeaderMenu = [
    {
        'name':'PEDIDOS',
        'href':'/sales/orders'
    },
    {
        'name':'VENTAS',
        'href':'/sales/consolidated'
    },
    {
        'name':'CLIENTES',
        'href':'/sales/clients-data'
    },
    {
        'name':'ESTADÍSTICAS',
        'href':'/sales/statistics/sales'
    }
]

const salesController = {
    orders: async(req,res) => {
        try{

            const selectedItem = 'PEDIDOS'
            const customers = await customersQueries.customers()
            const ordersManagers = await ordersManagersQueries.ordersManagers()
            const ordersStatus = await ordersStatusQueries.ordersStatus()

            return res.render('sales/orders',{title:'Pedidos',bottomHeaderMenu,selectedItem,customers,ordersManagers,ordersStatus})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    consolidated: (req,res) => {
        try{

            const selectedItem = 'VENTAS'

            return res.render('sales/consolidated',{title:'Ventas',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    customersData: (req,res) => {
        try{

            const selectedItem = 'CLIENTES'

            return res.render('sales/customersData',{title:'Clientes',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    salesStatistics: (req,res) => {
        try{

            const selectedItem = 'ESTADÍSTICAS'

            return res.render('sales/salesStatistics',{title:'Estadísticas',bottomHeaderMenu,selectedItem})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
}

module.exports = salesController

