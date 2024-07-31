const customersQueries = require('./dbQueries/data/customersQueries')
const ordersManagersQueries = require('./dbQueries/data/ordersManagersQueries')
const salesChannelsQueries = require('./dbQueries/data/salesChannelsQueries')
const ordersStatusQueries = require('./dbQueries/data/ordersStatusQueries')
const paymentsStatusQueries = require('./dbQueries/data/paymentsStatusQueries')
const paymentMethodsQueries = require('./dbQueries/data/paymentMethodsQueries')
const productsQueries = require('./dbQueries/cuttings/productsQueries')
const ordersQueries = require('./dbQueries/sales/ordersQueries')
const { datesToGet } = require('./functions/ninoxCronFunctions')

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
        name:'PAGOS',
        href:'/sales/payments',
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

            let date = new Date()
            const year = date.getFullYear()

            const selectedItem = 'VENTAS'
            const customers = await customersQueries.customers()
            const salesChannels = await salesChannelsQueries.salesChannels()
            const months = [
                {id:1,month:'Enero'},
                {id:2,month:'Febrero'},
                {id:3,month:'Marzo'},
                {id:4,month:'Abril'},
                {id:5,month:'Mayo'},
                {id:6,month:'Junio'},
                {id:7,month:'Julio'},
                {id:8,month:'Agosto'},
                {id:9,month:'Septiembre'},
                {id:10,month:'Octubre'},
                {id:11,month:'Noviembre'},
                {id:12,month:'Diciembre'},
            ]

            return res.render('sales/sales/sales',{title:'Ventas',bottomHeaderMenu,selectedItem,customers,year,salesChannels,months})
            
        }catch(error){

            console.log(error)
            return res.send('Ha ocurrido un error')
        }
    },
    payments: (req,res) => {
        try{

            const selectedItem = 'PAGOS'

            return res.render('sales/payments/payments',{title:'Pagos',bottomHeaderMenu,selectedItem})

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

