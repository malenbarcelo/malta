const customersQueries = require('./dbQueries/data/customersQueries')
const ordersManagersQueries = require('./dbQueries/data/ordersManagersQueries')
const ordersStatusQueries = require('./dbQueries/data/ordersStatusQueries')
const paymentsStatusQueries = require('./dbQueries/data/paymentsStatusQueries')
const paymentMethodsQueries = require('./dbQueries/data/paymentMethodsQueries')
const productsQueries = require('./dbQueries/cuttings/productsQueries')
const ordersQueries = require('./dbQueries/sales/ordersQueries')

const bottomHeaderMenu = [
    {
        id:1,
        name:'PEDIDOS',
        href:'/sales/in-progress-orders',
        subitems:[
            {'subitem':'Resumen de pedidos', 'href':'/sales/in-progress-orders'},
            {'subitem':'Detalle de pedidos', 'href':'/sales/in-progress-orders/details'}
        ]
    },
    {
        id:2,
        name:'VENTAS',
        href:'/sales/consolidated',
        subitems:[]
    },
    {
        id:3,
        name:'CLIENTES',
        href:'/sales/clients-data',
        subitems:[]
    },
    {
        id:4,
        name:'ESTADÍSTICAS',
        href:'/sales/statistics/sales',
        subitems:[]
    }
]

const salesController = {
    inProgressOrders: async(req,res) => {
        try{

            const selectedItem = 'PEDIDOS'
            const customers = await customersQueries.customers()
            const ordersManagers = await ordersManagersQueries.ordersManagers()
            const paymentMethods = await paymentMethodsQueries.paymentMethods()
            const ordersStatus = await ordersStatusQueries.ordersStatus()
            const paymentsStatus = await paymentsStatusQueries.paymentsStatus()
            const distinctProducts = await productsQueries.distinctProducts()
            const orders = await ordersQueries.inProgressOrders()

            return res.render('sales/orders/orders',{title:'Pedidos',bottomHeaderMenu,selectedItem,customers,ordersManagers,ordersStatus,paymentsStatus,distinctProducts,orders,paymentMethods})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    inProgressOrdersDetails: async(req,res) => {
        try{

            const selectedItem = 'PEDIDOS'
            const customers = await customersQueries.customers()
            const ordersManagers = await ordersManagersQueries.ordersManagers()
            const ordersStatus = await ordersStatusQueries.ordersStatus()
            const distinctProducts = await productsQueries.distinctProducts()
            const orders = await ordersQueries.inProgressOrders()

            return res.render('sales/orders/ordersdetails',{title:'Detalle de pedidos',bottomHeaderMenu,selectedItem,customers,ordersManagers,ordersStatus,distinctProducts,orders})

        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    sales: async(req,res) => {
        try{

            const selectedItem = 'VENTAS'
            const customers = await customersQueries.customers()

            return res.render('sales/sales/sales',{title:'Ventas',bottomHeaderMenu,selectedItem,customers,})
            
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

